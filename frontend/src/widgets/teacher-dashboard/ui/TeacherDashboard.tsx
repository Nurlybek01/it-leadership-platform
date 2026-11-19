import { useState } from "react";
import { Icon } from "../../../shared/ui/Icon";

type Tab = "course" | "tasks" | "students";

type Course = {
  title: string;
  description: string;
  githubTarget: string;
};

type Task = {
  title: string;
  type: "Лабораторная" | "Задание";
  module: string;
  repository: string;
  dueDate: string;
  status: "Опубликовано" | "Черновик";
};

type Student = {
  name: string;
  email: string;
  progress: number;
  github: string | null;
};

const initialCourse: Course = {
  title: "Лидерство в IT",
  description:
    "Практический курс о развитии лидерских навыков, управлении командами и достижении результата в IT.",
  githubTarget: "",
};

const initialTasks: Task[] = [
  {
    title: "Разбор сложного разговора",
    type: "Задание",
    module: "Коммуникация",
    repository: "leadership-course-template",
    dueDate: "Сегодня",
    status: "Опубликовано",
  },
  {
    title: "Карта ролей команды",
    type: "Лабораторная",
    module: "Команды и результат",
    repository: "",
    dueDate: "25 мая",
    status: "Опубликовано",
  },
  {
    title: "Личный план развития",
    type: "Лабораторная",
    module: "Осознанное лидерство",
    repository: "",
    dueDate: "Черновик",
    status: "Черновик",
  },
];

const students: Student[] = [
  {
    name: "Айдана Сапарова",
    email: "aidana.saparova@student.tou.edu.kz",
    progress: 92,
    github: "aidana-s",
  },
  {
    name: "Марат Нурланов",
    email: "marat.nurlanov@student.tou.edu.kz",
    progress: 81,
    github: "marat-n",
  },
  {
    name: "Алина Ким",
    email: "alina.kim@student.tou.edu.kz",
    progress: 68,
    github: null,
  },
  {
    name: "Данияр Ахметов",
    email: "daniyar.akhmetov@student.tou.edu.kz",
    progress: 54,
    github: "daniyar-a",
  },
  {
    name: "София Ермекова",
    email: "sofia.ermekova@student.tou.edu.kz",
    progress: 41,
    github: null,
  },
];

const tabs: { id: Tab; label: string }[] = [
  { id: "course", label: "Курс" },
  { id: "tasks", label: "Задания и лабораторные" },
  { id: "students", label: "Студенты" },
];

export function TeacherDashboard({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("course");
  const [course, setCourse] = useState(initialCourse);
  const [tasks, setTasks] = useState(initialTasks);
  const [isCourseFormOpen, setCourseFormOpen] = useState(false);
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  const [githubNotice, setGithubNotice] = useState(false);

  const saveCourse = (nextCourse: Course) => {
    setCourse(nextCourse);
    setCourseFormOpen(false);
  };

  const addTask = (task: Omit<Task, "status">) => {
    setTasks((currentTasks) => [
      { ...task, status: "Опубликовано" },
      ...currentTasks,
    ]);
    setTaskFormOpen(false);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-label font-bold uppercase text-brand-600">
            Кабинет преподавателя
          </p>
          <h1 className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950 sm:text-display-md">
            Привет, {name.split(" ")[0]}!
          </h1>
          <p className="mt-3 text-body-md text-ink-500">
            Управляйте учебной программой и следите за прогрессом студентов.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3.5 text-body-sm font-bold text-white transition-colors hover:bg-brand-700"
          onClick={() => {
            setActiveTab("tasks");
            setTaskFormOpen(true);
          }}
        >
          Добавить задание <Icon name="arrow" className="size-4" />
        </button>
      </div>

      <section className="mt-8 rounded-xl bg-linear-to-br from-brand-700 to-brand-500 p-6 text-white shadow-(--shadow-card) sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-label font-bold uppercase text-brand-200">
              Ваш курс
            </p>
            <h2 className="mt-3 font-display text-heading-xl font-bold sm:text-display-md">
              {course.title}
            </h2>
            <p className="mt-3 max-w-2xl text-body-md text-brand-100">
              {course.description}
            </p>
          </div>
          <span className="w-fit rounded-pill bg-white/15 px-3 py-1.5 text-body-xs font-bold">
            32 студента
          </span>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat value="32" label="Студента на курсе" color="bg-brand-500" />
        <Stat value="78%" label="Средний прогресс" color="bg-accent-500" />
        <Stat
          value={String(
            tasks.filter((task) => task.status === "Опубликовано").length,
          )}
          label="Активных заданий"
          color="bg-success-500"
        />
      </section>

      <nav
        className="mt-8 flex gap-1 overflow-x-auto border-b border-(--color-border)"
        aria-label="Разделы курса"
      >
        {tabs.map((tab) => (
          <button
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-body-sm font-bold transition-colors ${activeTab === tab.id ? "border-brand-600 text-brand-600" : "border-transparent text-ink-500 hover:text-ink-800"}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "course" && (
        <CoursePanel
          course={course}
          onEdit={() => setCourseFormOpen(true)}
          onGithub={() => setGithubNotice(true)}
        />
      )}
      {activeTab === "tasks" && (
        <TasksPanel tasks={tasks} onAdd={() => setTaskFormOpen(true)} />
      )}
      {activeTab === "students" && <StudentsPanel students={students} />}

      {isCourseFormOpen && (
        <CourseForm
          course={course}
          onClose={() => setCourseFormOpen(false)}
          onSave={saveCourse}
        />
      )}
      {isTaskFormOpen && (
        <TaskForm onClose={() => setTaskFormOpen(false)} onSave={addTask} />
      )}
      {githubNotice && <GithubNotice onClose={() => setGithubNotice(false)} />}
    </>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <article className="rounded-xl border border-(--color-border) bg-white p-5 shadow-(--shadow-card)">
      <div className={`size-2.5 rounded-full ${color}`} />
      <p className="mt-5 text-data-xl font-bold text-ink-950">{value}</p>
      <p className="mt-1 text-body-sm text-ink-500">{label}</p>
    </article>
  );
}

function CoursePanel({
  course,
  onEdit,
  onGithub,
}: {
  course: Course;
  onEdit: () => void;
  onGithub: () => void;
}) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <article className="rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-label font-bold uppercase text-brand-600">
              Настройки курса
            </p>
            <h2 className="mt-2 text-heading-lg font-bold text-ink-950">
              {course.title}
            </h2>
          </div>
          <button
            className="text-body-sm font-bold text-brand-600 hover:text-brand-700"
            onClick={onEdit}
          >
            Изменить
          </button>
        </div>
        <p className="mt-4 text-body-sm leading-relaxed text-ink-500">
          {course.description}
        </p>
        <div className="mt-7 rounded-lg border border-dashed border-brand-200 bg-brand-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-body-sm font-bold text-ink-800">
                Шаблон курса
              </p>
              <p className="mt-1 text-body-xs text-ink-500">
                {course.githubTarget || "Репозиторий-шаблон пока не выбран"}
              </p>
            </div>
            <span className="rounded-pill bg-warning-100 px-2.5 py-1 text-[10px] font-bold text-warning-600">
              GitHub скоро
            </span>
          </div>
          <button
            className="mt-4 rounded-md border border-brand-200 bg-white px-3 py-2 text-body-xs font-bold text-brand-700 hover:border-brand-400"
            onClick={onGithub}
          >
            Привязать организацию или репозиторий
          </button>
        </div>
      </article>
      <article className="rounded-xl bg-ink-950 p-6 text-white shadow-(--shadow-card) sm:p-8">
        <p className="text-label font-bold uppercase text-brand-300">
          Ближайшая активность
        </p>
        <h2 className="mt-4 text-heading-lg font-bold">
          Разбор сложного разговора
        </h2>
        <p className="mt-3 text-body-sm leading-relaxed text-ink-300">
          Проверьте ответы студентов и оставьте обратную связь по практическому
          заданию.
        </p>
        <div className="mt-8 flex items-center justify-between text-body-xs text-ink-400">
          <span>12 работ ожидают проверки</span>
          <span>Сегодня</span>
        </div>
        <button className="mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-body-sm font-bold text-white transition-colors hover:bg-brand-500">
          Открыть работы
        </button>
      </article>
    </section>
  );
}

function TasksPanel({ tasks, onAdd }: { tasks: Task[]; onAdd: () => void }) {
  return (
    <section className="mt-8 rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-label font-bold uppercase text-brand-600">
            Учебные материалы
          </p>
          <h2 className="mt-2 text-heading-lg font-bold text-ink-950">
            Задания и лабораторные
          </h2>
        </div>
        <button
          className="rounded-md bg-brand-600 px-4 py-2.5 text-body-sm font-bold text-white hover:bg-brand-700"
          onClick={onAdd}
        >
          Добавить задание
        </button>
      </div>
      <div className="mt-6 divide-y divide-(--color-border)">
        {tasks.map((task) => (
          <div
            className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
            key={`${task.title}-${task.module}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 rounded-md px-2 py-1 text-[10px] font-bold ${task.type === "Лабораторная" ? "bg-accent-50 text-accent-700" : "bg-brand-50 text-brand-700"}`}
              >
                {task.type}
              </span>
              <div>
                <p className="text-body-sm font-bold text-ink-800">
                  {task.title}
                </p>
                <p className="mt-1 text-body-xs text-ink-500">
                  {task.module} · {task.dueDate}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-body-xs font-semibold text-ink-600">
                {task.repository ? `Шаблон: ${task.repository}` : "Без шаблона"}
              </p>
              <span
                className={`mt-1 inline-block text-[10px] font-bold ${task.status === "Черновик" ? "text-warning-600" : "text-success-600"}`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentsPanel({ students }: { students: Student[] }) {
  return (
    <section className="mt-8 rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-label font-bold uppercase text-brand-600">
            Группа курса
          </p>
          <h2 className="mt-2 text-heading-lg font-bold text-ink-950">
            Студенты
          </h2>
        </div>
        <span className="rounded-pill bg-brand-50 px-3 py-1.5 text-body-xs font-bold text-brand-700">
          32 участника
        </span>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-160 text-left">
          <thead>
            <tr className="border-b border-(--color-border) text-label font-bold uppercase text-ink-400">
              <th className="pb-3">Студент</th>
              <th className="pb-3">Прогресс</th>
              <th className="pb-3">GitHub-профиль</th>
              <th className="pb-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                className="border-b border-(--color-border) last:border-0"
                key={student.email}
              >
                <td className="py-4">
                  <p className="text-body-sm font-bold text-ink-800">
                    {student.name}
                  </p>
                  <p className="mt-1 text-body-xs text-ink-500">
                    {student.email}
                  </p>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-pill bg-ink-100">
                      <div
                        className="h-full rounded-pill bg-brand-500"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-body-xs font-bold text-ink-600">
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-4 text-body-sm">
                  {student.github ? (
                    <span className="font-semibold text-ink-700">
                      @{student.github}
                    </span>
                  ) : (
                    <span className="text-ink-400">Не привязан</span>
                  )}
                </td>
                <td className="py-4">
                  <button className="text-body-xs font-bold text-brand-600 hover:text-brand-700">
                    {student.github ? "Открыть профиль" : "Пригласить"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 rounded-lg bg-ink-50 p-3 text-body-xs text-ink-500">
        Привязка GitHub-профилей будет доступна после подключения интеграции.
      </p>
    </section>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-ink-950/40 p-5"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-(--shadow-popover) sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            className="text-heading-lg font-bold text-ink-950"
            id="modal-title"
          >
            {title}
          </h2>
          <button
            className="text-body-sm font-bold text-ink-400 hover:text-ink-800"
            aria-label="Закрыть"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CourseForm({
  course,
  onClose,
  onSave,
}: {
  course: Course;
  onClose: () => void;
  onSave: (course: Course) => void;
}) {
  const [form, setForm] = useState(course);
  return (
    <Modal title="Настроить курс" onClose={onClose}>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
      >
        <label className="block text-body-sm font-semibold text-ink-700">
          Название курса
          <input
            className="mt-2 w-full rounded-md border border-(--color-border) px-3 py-2.5 text-body-sm outline-none focus:border-brand-500"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            required
          />
        </label>
        <label className="block text-body-sm font-semibold text-ink-700">
          Описание
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-(--color-border) px-3 py-2.5 text-body-sm outline-none focus:border-brand-500"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            required
          />
        </label>
        <div className="rounded-lg bg-warning-50 p-3 text-body-xs text-warning-600">
          Подключение GitHub-организации или репозитория-шаблона появится здесь
          после реализации интеграции.
        </div>
        <button
          className="w-full rounded-md bg-brand-600 px-4 py-3 text-body-sm font-bold text-white hover:bg-brand-700"
          type="submit"
        >
          Сохранить курс
        </button>
      </form>
    </Modal>
  );
}

function TaskForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (task: Omit<Task, "status">) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    type: "Задание" as Task["type"],
    module: "Коммуникация",
    repository: "",
    dueDate: "",
  });
  return (
    <Modal title="Новое задание" onClose={onClose}>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ ...form, dueDate: form.dueDate || "Без срока" });
        }}
      >
        <label className="block text-body-sm font-semibold text-ink-700">
          Название
          <input
            className="mt-2 w-full rounded-md border border-(--color-border) px-3 py-2.5 text-body-sm outline-none focus:border-brand-500"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            placeholder="Например, Ретроспектива команды"
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-body-sm font-semibold text-ink-700">
            Тип
            <select
              className="mt-2 w-full rounded-md border border-(--color-border) bg-white px-3 py-2.5 text-body-sm"
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value as Task["type"] })
              }
            >
              <option>Задание</option>
              <option>Лабораторная</option>
            </select>
          </label>
          <label className="block text-body-sm font-semibold text-ink-700">
            Модуль
            <select
              className="mt-2 w-full rounded-md border border-(--color-border) bg-white px-3 py-2.5 text-body-sm"
              value={form.module}
              onChange={(event) =>
                setForm({ ...form, module: event.target.value })
              }
            >
              <option>Осознанное лидерство</option>
              <option>Коммуникация</option>
              <option>Команды и результат</option>
            </select>
          </label>
        </div>
        <label className="block text-body-sm font-semibold text-ink-700">
          Срок сдачи
          <input
            className="mt-2 w-full rounded-md border border-(--color-border) px-3 py-2.5 text-body-sm outline-none focus:border-brand-500"
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm({ ...form, dueDate: event.target.value })
            }
          />
        </label>
        <label className="block text-body-sm font-semibold text-ink-700">
          Репозиторий-шаблон{" "}
          <span className="font-normal text-ink-400">(необязательно)</span>
          <input
            className="mt-2 w-full rounded-md border border-(--color-border) px-3 py-2.5 text-body-sm outline-none focus:border-brand-500"
            value={form.repository}
            onChange={(event) =>
              setForm({ ...form, repository: event.target.value })
            }
            placeholder="GitHub будет подключен позже"
          />
        </label>
        <button
          className="w-full rounded-md bg-brand-600 px-4 py-3 text-body-sm font-bold text-white hover:bg-brand-700"
          type="submit"
        >
          Добавить в курс
        </button>
      </form>
    </Modal>
  );
}

function GithubNotice({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="GitHub-интеграция" onClose={onClose}>
      <div className="mt-5 rounded-lg bg-brand-50 p-4">
        <p className="text-body-sm font-semibold text-brand-800">
          Функция готовится к подключению
        </p>
        <p className="mt-2 text-body-xs leading-relaxed text-brand-700">
          Сейчас данные курса и студентов хранятся локально. Здесь появится
          выбор организации, репозитория-шаблона и синхронизация профилей.
        </p>
      </div>
      <button
        className="mt-5 w-full rounded-md border border-(--color-border) px-4 py-3 text-body-sm font-bold text-ink-700 hover:border-brand-300"
        onClick={onClose}
      >
        Понятно
      </button>
    </Modal>
  );
}
