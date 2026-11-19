import { Icon } from "../../../shared/ui/Icon";

export function Hero({
  isAuthenticated,
  onStart,
}: {
  isAuthenticated: boolean;
  onStart: () => void;
}) {
  return (
    <section className="relative mx-auto grid max-w-(--spacing-content) items-center gap-12 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-24">
      <div className="relative z-10 animate-slide-up">
        <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-brand-200 bg-brand-50 px-3 py-1.5 text-label font-bold uppercase text-brand-700">
          <span className="size-1.5 rounded-full bg-brand-500" />
          Платформа для лидеров IT
        </div>
        <h1 className="max-w-3xl font-display text-display-md font-bold tracking-tight text-ink-950 sm:text-display-lg lg:text-display-xl">
          Лидерство — это навык.
          <span className="block text-brand-600">Прокачайте его.</span>
        </h1>
        <p className="mt-6 max-w-xl text-body-lg text-ink-500">
          Интерактивная платформа, которая превращает развитие лидерских навыков
          в увлекательный командный квест.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3.5 text-body-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            onClick={onStart}
          >
            {isAuthenticated ? "Открыть свой путь" : "Начать путь бесплатно"}
            <Icon
              name="arrow"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-md border border-(--color-border) bg-white px-5 py-3.5 text-body-sm font-bold text-ink-700 transition-all hover:border-brand-300 hover:text-brand-600">
            <Icon name="play" className="size-4 fill-current" />
            Смотреть демо
          </button>
        </div>
        <div className="mt-8 flex items-center gap-3 text-body-xs text-ink-500">
          <div className="flex -space-x-2">
            {[
              "bg-brand-300",
              "bg-accent-300",
              "bg-warning-500",
              "bg-success-500",
            ].map((color, index) => (
              <span
                className={`flex size-7 items-center justify-center rounded-full border-2 border-(--color-bg) ${color} text-[10px] font-bold text-white`}
                key={color}
              >
                {["AK", "МР", "ИВ", "СН"][index]}
              </span>
            ))}
          </div>
          <span>
            <strong className="text-ink-800">2 400+</strong> специалистов уже
            развиваются
          </span>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-lg animate-pop lg:ml-auto">
        <div className="absolute -right-10 -top-10 size-52 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="absolute -bottom-8 -left-10 size-48 rounded-full bg-accent-200/60 blur-3xl" />
        <div className="relative rounded-xl border border-white/80 bg-white p-3 shadow-(--shadow-popover)">
          <div className="overflow-hidden rounded-lg bg-ink-950">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 text-body-xs font-semibold text-white/80">
                <span className="size-2 rounded-full bg-success-500" />
                Мой путь
              </div>
              <span className="rounded-pill bg-brand-500/20 px-2.5 py-1 text-[10px] font-bold text-brand-300">
                УРОВЕНЬ 04
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-body-xs text-ink-400">Текущий прогресс</p>
                  <p className="mt-1 text-data-xl font-bold text-white">68%</p>
                </div>
                <span className="mb-1 text-body-xs font-semibold text-success-400">
                  +12% за неделю
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-pill bg-white/10">
                <div className="h-full w-[68%] rounded-pill bg-linear-to-r from-brand-500 to-accent-400" />
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  ["12", "Заданий"],
                  ["04", "Команд"],
                  ["08", "Бейджей"],
                ].map(([value, label]) => (
                  <div
                    className="rounded-md border border-white/10 bg-white/5 p-3"
                    key={label}
                  >
                    <p className="text-data-md font-bold text-white">{value}</p>
                    <p className="mt-1 text-[10px] text-ink-400">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-brand-600 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-xs font-semibold text-brand-100">
                    Следующий челлендж
                  </span>
                  <span className="text-lg">✦</span>
                </div>
                <p className="mt-2 text-body-sm font-bold text-white">
                  Сложный разговор
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-brand-200">
                  <span>+250 XP</span>
                  <span>15 мин</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-5 hidden items-center gap-3 rounded-lg border border-(--color-border) bg-white p-3 shadow-(--shadow-card) sm:flex">
          <span className="flex size-9 items-center justify-center rounded-md bg-warning-50 text-lg">
            🏆
          </span>
          <div>
            <p className="text-[10px] font-medium text-ink-500">
              Новое достижение
            </p>
            <p className="text-body-xs font-bold text-ink-800">
              Командный игрок
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
