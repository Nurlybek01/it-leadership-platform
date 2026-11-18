import type { User } from '../../../../entities/user/model/types'
import { Icon, type IconName } from '../../../../shared/ui/Icon'

const stats = [
  { value: '68%', label: 'Общий прогресс', color: 'bg-brand-500' },
  { value: '12', label: 'Заданий выполнено', color: 'bg-accent-500' },
  { value: '08', label: 'Получено достижений', color: 'bg-success-500' },
]

const achievements: { title: string; description: string; icon: IconName; color: string }[] = [
  { title: 'Командный игрок', description: 'Помогаете команде двигаться вперёд', icon: 'users', color: 'bg-accent-50 text-accent-700' },
  { title: 'Чёткая цель', description: 'Ставите понятные и измеримые цели', icon: 'target', color: 'bg-brand-50 text-brand-700' },
  { title: 'Первый шаг', description: 'Завершили первое задание курса', icon: 'check', color: 'bg-success-50 text-success-600' },
]

const projects = [
  {
    name: 'Campus Connect',
    description: 'Сервис, который помогает студентам находить единомышленников и собирать команды.',
    role: 'Фасилитатор команды',
    status: 'Планирование',
    color: 'from-brand-500 to-indigo-400',
    initials: ['А', 'М', 'Д'],
  },
  {
    name: 'StudyFlow',
    description: 'Пространство для совместной подготовки к занятиям и обмена учебными материалами.',
    role: 'Участник команды',
    status: 'В работе',
    color: 'from-accent-500 to-teal-400',
    initials: ['С', 'А', 'И', 'М'],
  },
]

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('ru')
}

export function StudentHomePage({ user }: { user: User }) {
  const firstName = user.name.split(' ')[0]

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-label font-bold uppercase text-brand-600">Личный кабинет студента</p>
          <h1 className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950 sm:text-display-md">Привет, {firstName}!</h1>
          <p className="mt-3 text-body-md text-ink-500">Твой путь в команде и прогресс обучения — в одном месте.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-success-100 bg-success-50 px-3.5 py-2 text-body-xs font-bold text-success-700">
          <span className="size-2 rounded-full bg-success-500" />
          На пути к своей цели
        </span>
      </div>

      <section className="relative mt-8 overflow-hidden rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 p-6 text-white shadow-[var(--shadow-card)] sm:p-8" aria-labelledby="student-profile-title">
        <div aria-hidden="true" className="absolute -right-12 -top-20 size-64 rounded-full border-[32px] border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-28 right-1/4 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 font-display text-heading-lg font-bold shadow-inner sm:size-20 sm:text-display-md">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-label font-bold uppercase tracking-wider text-brand-100">Твой профиль</p>
              <h2 className="mt-1 truncate font-display text-heading-lg font-bold sm:text-heading-xl" id="student-profile-title">{user.name}</h2>
              <p className="mt-1 truncate text-body-sm text-white/75">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px]">
            <ProfileDetail icon="users" label="Учебная группа" value="IT-24 · команда «Вектор»" />
            <ProfileDetail icon="target" label="Роль в команде" value="Фасилитатор" />
          </div>
        </div>
        <p className="relative mt-6 border-t border-white/15 pt-4 text-body-xs text-white/70">Группа и роль в команде пока показаны на демонстрационных данных.</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3" aria-label="Учебная статистика">
        {stats.map((stat) => (
          <article className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]" key={stat.label}>
            <div className={`size-2.5 rounded-full ${stat.color}`} />
            <p className="mt-5 text-data-xl font-bold text-ink-950">{stat.value}</p>
            <p className="mt-1 text-body-sm text-ink-500">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]" aria-label="Задача и обучение">
        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-label font-bold uppercase text-brand-600">Задача для команды</p>
              <h2 className="mt-2 text-heading-lg font-bold text-ink-950">Подготовить план запуска MVP</h2>
            </div>
            <span className="rounded-pill bg-warning-50 px-3 py-1.5 text-body-xs font-bold text-warning-600">В работе · демо</span>
          </div>
          <p className="mt-4 max-w-2xl text-body-sm leading-relaxed text-ink-500">
            Согласуйте с командой главную ценность продукта, выберите три функции для первой версии и распределите ответственность за каждый шаг.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-y border-[var(--color-border)] py-4 text-body-xs font-semibold text-ink-600">
            <span className="inline-flex items-center gap-2"><Icon name="board" className="size-4 text-brand-600" />Команды и результат</span>
            <span className="inline-flex items-center gap-2"><Icon name="users" className="size-4 text-brand-600" />Команда «Вектор»</span>
            <span className="inline-flex items-center gap-2"><Icon name="target" className="size-4 text-warning-600" /><time dateTime="2026-11-24">Срок: 24 ноября</time></span>
          </div>
          <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50/70 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-body-xs font-bold uppercase tracking-wide text-brand-700">
              <Icon name="spark" className="size-4" />
              Вывод лидера
            </div>
            <p className="mt-2 text-body-sm leading-relaxed text-ink-700">«Вы хорошо договорились о цели. Теперь распределите ответственность заранее — так идея быстрее превратится в понятный план действий».</p>
            <p className="mt-3 text-body-xs font-semibold text-ink-500">Алина Нурбекова · тимлид команды</p>
          </div>
        </article>

        <article className="rounded-xl bg-ink-950 p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
          <p className="text-label font-bold uppercase text-brand-300">Текущий модуль</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <h2 className="text-heading-lg font-bold">Коммуникация</h2>
            <span className="rounded-pill bg-white/10 px-3 py-1.5 text-body-xs font-bold text-brand-200">02 / 03</span>
          </div>
          <p className="mt-4 text-body-sm leading-relaxed text-ink-300">Учись давать обратную связь, вести сложные разговоры и вдохновлять команду.</p>
          <div className="mt-7 flex items-center justify-between text-body-xs font-semibold text-ink-300"><span>Прогресс модуля</span><span className="text-brand-300">68%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-pill bg-white/10"><div className="h-full w-[68%] rounded-pill bg-gradient-to-r from-brand-400 to-accent-400" /></div>
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="text-body-xs font-semibold text-ink-400">Следующий челлендж</p>
            <p className="mt-2 text-body-sm font-bold">Сложный разговор</p>
            <div className="mt-3 flex items-center justify-between text-body-xs text-ink-400"><span>+250 XP</span><span>15 минут</span></div>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]" aria-label="Проекты и достижения">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-label font-bold uppercase text-brand-600">Работа в команде</p>
              <h2 className="mt-2 text-heading-lg font-bold text-ink-950">Мои проекты</h2>
            </div>
            <span className="rounded-pill bg-ink-100 px-3 py-1.5 text-body-xs font-semibold text-ink-600">{projects.length} активных</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <article className="rounded-lg border border-[var(--color-border)] p-4 transition-shadow hover:shadow-[var(--shadow-card)] sm:p-5" key={project.name}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-md bg-gradient-to-br ${project.color} text-body-sm font-bold text-white`}>{project.name.slice(0, 1)}</span>
                  <span className="rounded-pill bg-success-50 px-2.5 py-1 text-[10px] font-bold text-success-700">{project.status}</span>
                </div>
                <h3 className="mt-4 text-body-md font-bold text-ink-900">{project.name}</h3>
                <p className="mt-2 min-h-16 text-body-xs leading-relaxed text-ink-500">{project.description}</p>
                <p className="mt-3 border-t border-[var(--color-border)] pt-3 text-body-xs font-semibold text-ink-700">{project.role}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex -space-x-2" aria-label={`${project.initials.length} участника проекта`}>
                    {project.initials.map((initial, index) => <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-ink-100 text-[10px] font-bold text-ink-600" key={`${project.name}-${initial}-${index}`}>{initial}</span>)}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-ink-400"><Icon name="board" className="size-3.5" />GitHub скоро</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-body-xs text-ink-400">Состав и статусы проектов демонстрационные. Привязка GitHub появится позже.</p>
        </div>

        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="text-label font-bold uppercase text-brand-600">Твои успехи</p>
          <h2 className="mt-2 text-heading-lg font-bold text-ink-950">Достижения</h2>
          <div className="mt-5 space-y-4">
            {achievements.map((achievement) => (
              <div className="flex items-center gap-3" key={achievement.title}>
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-md ${achievement.color}`}><Icon name={achievement.icon} className="size-5" /></span>
                <div className="min-w-0">
                  <h3 className="text-body-sm font-bold text-ink-800">{achievement.title}</h3>
                  <p className="mt-0.5 text-body-xs leading-relaxed text-ink-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-ink-50 p-3 text-body-xs leading-relaxed text-ink-500">Достижения добавлены для демонстрации личного кабинета.</div>
        </article>
      </section>
    </>
  )
}

function ProfileDetail({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-3.5">
      <div className="flex items-center gap-2 text-body-xs font-medium text-white/70"><Icon name={icon} className="size-4" />{label}</div>
      <p className="mt-2 text-body-sm font-bold text-white">{value}</p>
    </div>
  )
}
