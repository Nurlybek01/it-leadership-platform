import type { MouseEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  getModuleStatus,
  modules,
} from "../../../../entities/module/model/catalog";
import type {
  ModuleContent,
  ModuleStatus,
} from "../../../../entities/module/model/types";
import { navigate } from "../../../../shared/lib/router";
import { Icon } from "../../../../shared/ui/Icon";

const completedModuleIds = new Set<string>();
const statusLabels: Record<ModuleStatus, string> = {
  locked: "Закрыт",
  available: "Доступен",
  in_progress: "В процессе",
  passed: "Пройден",
};

function followLink(event: MouseEvent<HTMLAnchorElement>, path: string) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  navigate(path);
}

function ModuleTheory({ module }: { module: ModuleContent }) {
  return (
    <div className="rounded-xl border border-(--color-border) bg-white p-5 shadow-(--shadow-card) sm:p-8">
      <div className="prose-module">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="mb-3 mt-8 font-display text-heading-md font-bold text-ink-950 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-6 text-heading-sm font-bold text-ink-900">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-body-md leading-7 text-ink-700">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-5 list-disc space-y-2 pl-6 text-body-md leading-7 text-ink-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-5 list-decimal space-y-2 pl-6 text-body-md leading-7 text-ink-700">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,
            a: ({ children, href }) => (
              <a
                className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900"
                href={href}
                rel="noreferrer"
                target="_blank"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="mb-5 border-l-4 border-brand-300 pl-4 text-ink-600">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-body-sm text-ink-800">
                {children}
              </code>
            ),
          }}
        >
          {module.theory.markdown}
        </ReactMarkdown>
      </div>

      <div className="mt-8 grid gap-6 border-t border-(--color-border) pt-6 sm:grid-cols-2">
        <section aria-labelledby="module-videos-title">
          <h2
            className="text-heading-sm font-bold text-ink-900"
            id="module-videos-title"
          >
            Видео
          </h2>
          {module.theory.videos.length === 0 ? (
            <p className="mt-2 text-body-sm text-ink-500">
              Видео для этого модуля пока не добавлены.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {module.theory.videos.map((video) => (
                <li key={video.url ?? video.title}>
                  <a
                    className="text-body-sm font-semibold text-brand-700 hover:text-brand-900"
                    href={video.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="module-references-title">
          <h2
            className="text-heading-sm font-bold text-ink-900"
            id="module-references-title"
          >
            Литература
          </h2>
          {module.theory.references.length === 0 ? (
            <p className="mt-2 text-body-sm text-ink-500">
              Список литературы пока не добавлен.
            </p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-body-sm text-ink-600">
              {module.theory.references.map((reference) => (
                <li key={reference.url ?? reference.title}>
                  {reference.url ? (
                    <a
                      className="font-semibold text-brand-700 hover:text-brand-900"
                      href={reference.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {reference.title}
                    </a>
                  ) : (
                    reference.title
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function ModuleDetail({
  module,
  status,
}: {
  module: ModuleContent;
  status: ModuleStatus;
}) {
  if (status === "locked") {
    const prerequisites = module.prerequisites
      .map((id) => modules.find((item) => item.id === id)?.title)
      .filter((title): title is string => Boolean(title));

    return (
      <section
        className="rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8"
        aria-labelledby="module-locked-title"
      >
        <a
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-brand-700 hover:text-brand-900"
          href="/dashboard/modules"
          onClick={(event) => followLink(event, "/dashboard/modules")}
        >
          <Icon name="arrow" className="size-4 rotate-180" />
          Все модули
        </a>
        <div className="mt-8 flex size-12 items-center justify-center rounded-full bg-ink-100 text-ink-500">
          <Icon name="lock" />
        </div>
        <h1
          className="mt-4 font-display text-heading-xl font-bold text-ink-950"
          id="module-locked-title"
        >
          {module.title}
        </h1>
        <p className="mt-3 text-body-md text-ink-600">
          Модуль пока закрыт. Сначала пройдите: {prerequisites.join(", ")}.
        </p>
      </section>
    );
  }

  return (
    <div>
      <a
        className="inline-flex items-center gap-2 text-body-sm font-semibold text-brand-700 hover:text-brand-900"
        href="/dashboard/modules"
        onClick={(event) => followLink(event, "/dashboard/modules")}
      >
        <Icon name="arrow" className="size-4 rotate-180" />
        Все модули
      </a>
      <header className="mb-6 mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-label font-bold uppercase tracking-wider text-brand-600">
            Модуль {module.order}
          </p>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-body-xs font-bold text-brand-700">
            {statusLabels[status]}
          </span>
        </div>
        <h1 className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950">
          {module.title}
        </h1>
        <p className="mt-2 max-w-3xl text-body-md text-ink-600">
          {module.description}
        </p>
      </header>
      <ModuleTheory module={module} />
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5">
        <h2 className="text-heading-sm font-bold text-brand-900">
          Следующий шаг
        </h2>
        <p className="mt-1 text-body-sm text-brand-800">
          После теории пройдите мини-тест и выполните практическое задание. Эти
          этапы появятся в следующих шагах реализации.
        </p>
      </div>
    </div>
  );
}

export function ModulesPage({ path }: { path: string }) {
  const moduleId = path.match(/^\/dashboard\/modules\/([^/]+)\/?$/)?.[1];
  const selectedModule = moduleId
    ? modules.find((module) => module.id === moduleId)
    : undefined;

  if (moduleId && !selectedModule) {
    return (
      <section
        className="rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8"
        aria-labelledby="module-not-found-title"
      >
        <h1
          className="font-display text-heading-xl font-bold text-ink-950"
          id="module-not-found-title"
        >
          Модуль не найден
        </h1>
        <a
          className="mt-4 inline-flex text-body-sm font-semibold text-brand-700 hover:text-brand-900"
          href="/dashboard/modules"
          onClick={(event) => followLink(event, "/dashboard/modules")}
        >
          Вернуться к списку
        </a>
      </section>
    );
  }

  if (selectedModule) {
    return (
      <ModuleDetail
        module={selectedModule}
        status={getModuleStatus(selectedModule, completedModuleIds)}
      />
    );
  }

  return (
    <section
      className="rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8"
      aria-labelledby="student-modules-title"
    >
      <p className="text-label font-bold uppercase tracking-wider text-brand-600">
        Обучение
      </p>
      <h1
        className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950"
        id="student-modules-title"
      >
        Учебные модули
      </h1>
      <p className="mt-2 max-w-2xl text-body-md text-ink-600">
        Изучайте теорию, проверяйте знания и применяйте их на практике в GitHub.
      </p>

      <ol className="mt-8 grid gap-4 xl:grid-cols-2">
        {modules.map((module) => {
          const status = getModuleStatus(module, completedModuleIds);
          const isLocked = status === "locked";
          const modulePath = `/dashboard/modules/${module.id}`;
          const content = (
            <>
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isLocked ? "bg-ink-100 text-ink-400" : "bg-brand-50 text-brand-700"}`}
                >
                  {isLocked ? (
                    <Icon name="lock" className="size-4" />
                  ) : (
                    <span className="text-body-sm font-bold">
                      {module.order}
                    </span>
                  )}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-body-xs font-bold ${isLocked ? "bg-ink-100 text-ink-500" : "bg-brand-50 text-brand-700"}`}
                >
                  {statusLabels[status]}
                </span>
              </div>
              <h2
                className={`mt-4 text-heading-md font-bold ${isLocked ? "text-ink-500" : "text-ink-950"}`}
              >
                {module.title}
              </h2>
              <p
                className={`mt-2 text-body-sm ${isLocked ? "text-ink-400" : "text-ink-600"}`}
              >
                {module.description}
              </p>
              <p
                className={`mt-5 text-body-xs font-semibold ${isLocked ? "text-ink-400" : "text-brand-700"}`}
              >
                {isLocked
                  ? "Пройдите предыдущие модули, чтобы открыть"
                  : "Открыть модуль"}
              </p>
            </>
          );

          return (
            <li className="list-none" key={module.id}>
              {isLocked ? (
                <div
                  aria-disabled="true"
                  className="h-full min-h-52 rounded-xl border border-(--color-border) bg-ink-50 p-5 opacity-80"
                >
                  {content}
                </div>
              ) : (
                <a
                  className="block h-full min-h-52 rounded-xl border border-(--color-border) bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-(--shadow-card-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  href={modulePath}
                  onClick={(event) => followLink(event, modulePath)}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
