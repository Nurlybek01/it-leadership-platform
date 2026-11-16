import { useEffect } from 'react'
import { useAuth } from '../../../features/auth/model/useAuth'
import { roleLabels } from '../../../entities/user/model/types'
import { navigate } from '../../../shared/lib/router'
import { Icon } from '../../../shared/ui/Icon'
import { TeacherDashboard } from '../../../widgets/teacher-dashboard/ui/TeacherDashboard'

const stats = [
  { value: '68%', label: 'Общий прогресс', color: 'bg-brand-500' },
  { value: '12', label: 'Заданий выполнено', color: 'bg-accent-500' },
  { value: '08', label: 'Получено бейджей', color: 'bg-success-500' },
]

export function DashboardPage() {
  const auth = useAuth()

  useEffect(() => {
    if (auth.isReady && !auth.user) navigate('/')
  }, [auth.isReady, auth.user])

  if (!auth.isReady || !auth.user) return null

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-[var(--spacing-content)] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <a className="flex items-center gap-2.5" href="/dashboard">
            <span className="flex size-9 items-center justify-center rounded-md bg-brand-600 text-white shadow-glow"><Icon name="spark" className="size-5" /></span>
            <span className="font-display text-heading-sm font-bold tracking-tight text-ink-900">Lead<span className="text-brand-600">craft</span></span>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-body-xs font-bold text-ink-800">{auth.user.name}</p><p className="text-[10px] text-ink-500">{roleLabels[auth.user.role]}</p></div>
            <button className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-body-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-600" onClick={() => void auth.logout()}>Выйти</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--spacing-content)] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {auth.user.role === 'teacher' ? <TeacherDashboard name={auth.user.name} /> : <StudentDashboard name={auth.user.name} />}
      </div>
    </main>
  )
}

function StudentDashboard({ name }: { name: string }) {
  return <>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="text-label font-bold uppercase text-brand-600">Личный кабинет</p><h1 className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950 sm:text-display-md">Привет, {name.split(' ')[0]}!</h1><p className="mt-3 text-body-md text-ink-500">Продолжайте развивать лидерские навыки.</p></div>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3.5 text-body-sm font-bold text-white transition-colors hover:bg-brand-700">Продолжить обучение <Icon name="arrow" className="size-4" /></button>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => <article className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]" key={stat.label}><div className={`size-2.5 rounded-full ${stat.color}`} /><p className="mt-5 text-data-xl font-bold text-ink-950">{stat.value}</p><p className="mt-1 text-body-sm text-ink-500">{stat.label}</p></article>)}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center justify-between"><div><p className="text-label font-bold uppercase text-brand-600">Текущий модуль</p><h2 className="mt-2 text-heading-lg font-bold text-ink-950">Коммуникация</h2></div><span className="rounded-pill bg-brand-50 px-3 py-1.5 text-body-xs font-bold text-brand-700">02 / 03</span></div>
            <p className="mt-4 max-w-xl text-body-sm leading-relaxed text-ink-500">Учитесь давать обратную связь, вести сложные разговоры и вдохновлять команду.</p>
            <div className="mt-7 flex items-center justify-between text-body-xs font-semibold text-ink-500"><span>Прогресс модуля</span><span className="text-brand-600">68%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-pill bg-ink-100"><div className="h-full w-[68%] rounded-pill bg-gradient-to-r from-brand-500 to-accent-400" /></div>
            <button className="mt-7 rounded-md border border-[var(--color-border)] px-4 py-2.5 text-body-sm font-bold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600">Открыть модуль</button>
          </article>
          <article className="rounded-xl bg-ink-950 p-6 text-white shadow-[var(--shadow-card)] sm:p-8"><p className="text-label font-bold uppercase text-brand-300">Следующий челлендж</p><h2 className="mt-4 text-heading-lg font-bold">Сложный разговор</h2><p className="mt-3 text-body-sm leading-relaxed text-ink-300">Потренируйтесь давать честную и поддерживающую обратную связь.</p><div className="mt-8 flex items-center justify-between text-body-xs text-ink-400"><span>+250 XP</span><span>15 минут</span></div><button className="mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-body-sm font-bold text-white transition-colors hover:bg-brand-500">Начать челлендж</button></article>
        </section>
      </>
}
