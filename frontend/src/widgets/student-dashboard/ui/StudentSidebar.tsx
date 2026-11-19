import { navigate } from "../../../shared/lib/router";
import { Icon } from "../../../shared/ui/Icon";
import {
  studentPages,
  type StudentPage,
} from "../../../pages/student/model/routes";

export function StudentSidebar({ activePage }: { activePage: StudentPage }) {
  return (
    <aside className="min-w-0 rounded-xl border border-(--color-border) bg-white p-3 shadow-(--shadow-card) lg:sticky lg:top-5 lg:min-h-[calc(100vh-7rem)] lg:self-stretch">
      <p className="px-3 py-2 text-label font-bold uppercase tracking-wider text-ink-400">
        Меню студента
      </p>
      <nav
        aria-label="Навигация студента"
        className="mt-1 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {studentPages.map((item) => {
          const isActive = item.id === activePage;
          return (
            <a
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-semibold ${isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"}`}
              href={item.path}
              key={item.id}
              title={item.label}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                navigate(item.path);
              }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center">
                <Icon
                  name={item.icon}
                  className={`size-4 ${isActive ? "text-brand-600" : "text-ink-400"}`}
                />
              </span>
              <span className="whitespace-nowrap">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
