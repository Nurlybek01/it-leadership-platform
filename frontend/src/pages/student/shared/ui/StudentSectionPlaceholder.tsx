export function StudentSectionPlaceholder({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  return (
    <section
      className="min-h-112 rounded-xl border border-(--color-border) bg-white p-6 shadow-(--shadow-card) sm:p-8"
      aria-labelledby="student-placeholder-title"
    >
      <p className="text-label font-bold uppercase text-brand-600">
        Раздел студента
      </p>
      <h1
        className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950"
        id="student-placeholder-title"
      >
        {title}
      </h1>
      <p className="mt-3 text-body-md text-ink-500">
        Заглушка страницы «{title.toLowerCase()}» для проверки маршрутизации.
      </p>
      <p className="mt-6 inline-flex rounded-md bg-ink-50 px-3 py-2 font-mono text-body-xs text-ink-500">
        {path}
      </p>
    </section>
  );
}
