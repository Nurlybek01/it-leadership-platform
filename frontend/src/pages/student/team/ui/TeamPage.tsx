import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "../../../../entities/user/model/types";
import { supabase } from "../../../../shared/config/supabase";

type GroupMember = { id: string; name: string; email: string };
type StudentGroup = {
  id: string;
  name: string;
  createdAt: string;
  members: GroupMember[];
};
type StudentLookup = { user_id: string; name: string; email: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseGroupMember(value: unknown): GroupMember {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string"
  ) {
    throw new Error("Не удалось загрузить список участников.");
  }
  return { id: value.id, name: value.name, email: value.email };
}

function parseGroups(value: unknown): StudentGroup[] {
  if (!Array.isArray(value))
    throw new Error("Не удалось загрузить список групп.");

  return value.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.createdAt !== "string" ||
      !Array.isArray(item.members)
    ) {
      throw new Error("Не удалось загрузить список групп.");
    }
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      members: item.members.map(parseGroupMember),
    };
  });
}

function isStudentLookup(value: unknown): value is StudentLookup {
  return (
    isRecord(value) &&
    typeof value.user_id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "неизвестная ошибка";
}

function rpcErrorMessage(error: { code?: string; message: string }): string {
  return error.code === "PGRST202"
    ? "Функция Supabase не найдена. Примените SQL-миграцию групп или обновите кэш схемы командой NOTIFY pgrst, 'reload schema'."
    : error.message;
}

export function TeamPage({ user }: { user: User }) {
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<StudentLookup[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const receiveGroups = useCallback(
    (
      data: unknown,
      requestError: { code?: string; message: string } | null,
    ) => {
      setIsLoading(false);
      if (requestError) {
        setError(
          `Не удалось загрузить группы: ${rpcErrorMessage(requestError)}`,
        );
        return;
      }
      try {
        setGroups(parseGroups(data));
        setError("");
      } catch (parseError) {
        setError(
          parseError instanceof Error
            ? parseError.message
            : "Не удалось загрузить группы.",
        );
      }
    },
    [],
  );

  const loadGroups = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error: requestError } = await supabase.rpc(
        "get_my_student_groups",
      );
      receiveGroups(data, requestError);
    } catch (requestError) {
      setIsLoading(false);
      setError(`Не удалось загрузить группы: ${errorMessage(requestError)}`);
    }
  }, [receiveGroups]);

  useEffect(() => {
    if (!supabase) return;
    let isActive = true;
    void Promise.resolve(supabase.rpc("get_my_student_groups"))
      .then(({ data, error: requestError }) => {
        if (isActive) receiveGroups(data, requestError);
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;
        setIsLoading(false);
        setError(
          `Не удалось загрузить группы: ${requestError instanceof Error ? requestError.message : "неизвестная ошибка"}`,
        );
      });
    return () => {
      isActive = false;
    };
  }, [receiveGroups]);

  const addMember = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Введите email участника.");
      return;
    }
    if (members.length >= 4) {
      setError("В группе может быть не больше 5 человек, включая вас.");
      return;
    }
    if (
      normalizedEmail === user.email.toLowerCase() ||
      members.some((member) => member.email === normalizedEmail)
    ) {
      setError("Этот аккаунт уже добавлен в группу.");
      return;
    }
    if (!supabase) {
      setError("Supabase не настроен. Добавьте переменные окружения.");
      return;
    }

    setIsLookingUp(true);
    setError("");
    try {
      const { data, error: requestError } = await supabase.rpc(
        "find_student_by_email",
        { p_email: normalizedEmail },
      );
      setIsLookingUp(false);
      if (requestError) {
        setError(`Не удалось найти студента: ${rpcErrorMessage(requestError)}`);
        return;
      }
      const found = Array.isArray(data) ? data[0] : null;
      if (!isStudentLookup(found)) {
        setError("Студент с таким email не найден.");
        return;
      }
      if (members.some((member) => member.user_id === found.user_id)) {
        setError("Этот участник уже добавлен в группу.");
        return;
      }
      setMembers((current) => [...current, found]);
      setEmail("");
    } catch (requestError) {
      setIsLookingUp(false);
      setError(`Не удалось найти студента: ${errorMessage(requestError)}`);
      return;
    }
  };

  const createGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase не настроен. Добавьте переменные окружения.");
      return;
    }
    setIsCreating(true);
    setError("");
    try {
      const { error: requestError } = await supabase.rpc(
        "create_student_group",
        {
          p_name: groupName.trim(),
          p_member_emails: members.map((member) => member.email),
        },
      );
      setIsCreating(false);
      if (requestError) {
        setError(`Не удалось создать группу: ${rpcErrorMessage(requestError)}`);
        return;
      }
      setGroupName("");
      setMembers([]);
      await loadGroups();
    } catch (requestError) {
      setIsCreating(false);
      setError(`Не удалось создать группу: ${errorMessage(requestError)}`);
      return;
    }
  };

  return (
    <section
      className="min-h-112 rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8"
      aria-labelledby="student-team-title"
    >
      <p className="text-label font-bold uppercase text-brand-600">
        Раздел студента
      </p>
      <h1
        className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950"
        id="student-team-title"
      >
        Команда
      </h1>
      <p className="mt-2 text-body-md text-ink-500">
        Создайте группу и добавьте в неё студентов по email. В группе может быть
        до 5 человек, включая вас.
      </p>

      {!supabase ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-body-sm text-amber-800">
          Для работы с группами настройте подключение Supabase.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form
            className="rounded-xl border border-(--color-border) p-5 sm:p-6"
            onSubmit={(event) => void createGroup(event)}
          >
            <h2 className="text-heading-md font-bold text-ink-900">
              Новая группа
            </h2>
            <label
              className="mt-5 block text-body-sm font-semibold text-ink-700"
              htmlFor="student-group-name"
            >
              Название группы
            </label>
            <input
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-(--color-border) px-3 py-2.5 text-body-sm text-ink-900 outline-none focus:border-brand-500"
              id="student-group-name"
              maxLength={80}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Например, Команда проекта"
              required
              value={groupName}
            />

            <label
              className="mt-5 block text-body-sm font-semibold text-ink-700"
              htmlFor="student-group-member-email"
            >
              Добавить студента по email
            </label>
            <div className="mt-2 flex gap-2">
              <input
                autoComplete="email"
                className="min-w-0 flex-1 rounded-lg border border-(--color-border) px-3 py-2.5 text-body-sm text-ink-900 outline-none focus:border-brand-500"
                id="student-group-member-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                type="email"
                value={email}
              />
              <button
                className="rounded-lg border border-brand-200 px-4 py-2 text-body-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLookingUp || members.length >= 4}
                onClick={() => void addMember()}
                type="button"
              >
                {isLookingUp ? "Поиск…" : "Добавить"}
              </button>
            </div>
            <p className="mt-2 text-body-xs text-ink-500">
              Мест занято: {members.length + 1} из 5 (вы — создатель группы).
            </p>

            {members.length > 0 && (
              <ul className="mt-4 space-y-2" aria-label="Добавленные участники">
                {members.map((member) => (
                  <li
                    className="flex items-center justify-between gap-3 rounded-lg bg-ink-50 px-3 py-2"
                    key={member.user_id}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm font-semibold text-ink-800">
                        {member.name}
                      </span>
                      <span className="block truncate text-body-xs text-ink-500">
                        {member.email}
                      </span>
                    </span>
                    <button
                      aria-label={`Удалить ${member.name}`}
                      className="shrink-0 rounded px-2 py-1 text-body-xs font-semibold text-ink-500 hover:bg-white hover:text-red-600"
                      onClick={() =>
                        setMembers((current) =>
                          current.filter(
                            (item) => item.user_id !== member.user_id,
                          ),
                        )
                      }
                      type="button"
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <p
                className="mt-4 rounded-lg bg-red-50 p-3 text-body-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 text-body-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCreating || isLookingUp || !groupName.trim()}
              type="submit"
            >
              {isCreating ? "Создание…" : "Создать группу"}
            </button>
          </form>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-heading-md font-bold text-ink-900">
                Мои группы
              </h2>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-body-xs font-bold text-brand-700">
                {groups.length}
              </span>
            </div>
            {isLoading ? (
              <p className="mt-5 text-body-sm text-ink-500">
                Загружаем группы…
              </p>
            ) : groups.length === 0 ? (
              <p className="mt-5 rounded-lg bg-ink-50 p-4 text-body-sm text-ink-500">
                Пока нет групп. Создайте первую — она появится здесь.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {groups.map((group) => (
                  <li
                    className="rounded-xl border border-(--color-border) p-4"
                    key={group.id}
                  >
                    <h3 className="font-semibold text-ink-900">{group.name}</h3>
                    <p className="mt-1 text-body-xs text-ink-500">
                      {group.members.length} из 5 участников
                    </p>
                    <ul className="mt-3 space-y-2">
                      {group.members.map((member) => (
                        <li
                          className="flex min-w-0 items-center gap-3 text-body-sm"
                          key={member.id}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-body-xs font-bold text-brand-700">
                            {member.name.trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-ink-800">
                              {member.name}
                              {member.email.toLowerCase() ===
                              user.email.toLowerCase()
                                ? " (вы)"
                                : ""}
                            </span>
                            <span className="block truncate text-body-xs text-ink-500">
                              {member.email}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
