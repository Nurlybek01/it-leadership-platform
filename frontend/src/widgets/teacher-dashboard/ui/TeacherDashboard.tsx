import { Icon } from '../../../shared/ui/Icon'

const stats = [
  { value: '32', label: 'Студента на курсе', color: 'bg-brand-500' },
  { value: '78%', label: 'Средний прогресс', color: 'bg-accent-500' },
  { value: '14', label: 'Активных заданий', color: 'bg-success-500' },
]

const modules = [
  { title: 'Осознанное лидерство', progress: '92%', students: '32/32', color: 'bg-brand-500' },
  { title: 'Коммуникация', progress: '68%', students: '25/32', color: 'bg-accent-500' },
  { title: 'Команды и результат', progress: '41%', students: '18/32', color: 'bg-success-500' },
]

export function TeacherDashboard({ name }: { name: string }) {
  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-label font-bold uppercase text-brand-600">Кабинет преподавателя</p>
          <h1 className="mt-3 font-display text-heading-xl font-bold tracking-tight text-ink-950 sm:text-display-md">Привет, {name.split(' ')[0]}!</h1>
          <p className="mt-3 text-body-md text-ink-500">Управляйте учебной программой и следите за прогрессом студентов.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3.5 text-body-sm font-bold text-white transition-colors hover:bg-brand-700">
          Добавить задание <Icon name="arrow" className="size-4" />
        </button>
      </div>

      <section className="mt-8 rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-label font-bold uppercase text-brand-200">Ваш предмет</p>
            <h2 className="mt-3 font-display text-heading-xl font-bold sm:text-display-md">Лидерство в IT</h2>
            <p className="mt-3 max-w-2xl text-body-md text-brand-100">Практический курс о развитии лидерских навыков, управлении командами и достижении результата в IT.</p>
          </div>
          <span className="w-fit rounded-pill bg-white/15 px-3 py-1.5 text-body-xs font-bold">3 модуля</span>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => <article className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]" key={stat.label}><div className={`size-2.5 rounded-full ${stat.color}`} /><p className="mt-5 text-data-xl font-bold text-ink-950">{stat.value}</p><p className="mt-1 text-body-sm text-ink-500">{stat.label}</p></article>)}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex items-center justify-between"><div><p className="text-label font-bold uppercase text-brand-600">Программа курса</p><h2 className="mt-2 text-heading-lg font-bold text-ink-950">Лидерство в IT</h2></div><button className="text-body-sm font-bold text-brand-600 hover:text-brand-700">Настроить</button></div>
          <div className="mt-6 space-y-5">
            {modules.map((module, index) => <div key={module.title}><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className={`flex size-8 items-center justify-center rounded-md ${module.color} text-body-xs font-bold text-white`}>0{index + 1}</span><span className="text-body-sm font-semibold text-ink-800">{module.title}</span></div><span className="text-body-xs font-bold text-ink-500">{module.progress}</span></div><div className="mt-2 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-pill bg-ink-100"><div className={`h-full rounded-pill ${module.color}`} style={{ width: module.progress }} /></div><span className="w-12 text-right text-[10px] text-ink-400">{module.students}</span></div></div>)}
          </div>
        </article>
        <article className="rounded-xl bg-ink-950 p-6 text-white shadow-[var(--shadow-card)] sm:p-8"><p className="text-label font-bold uppercase text-brand-300">Ближайшая активность</p><h2 className="mt-4 text-heading-lg font-bold">Разбор сложного разговора</h2><p className="mt-3 text-body-sm leading-relaxed text-ink-300">Проверьте ответы студентов и оставьте обратную связь по практическому заданию.</p><div className="mt-8 flex items-center justify-between text-body-xs text-ink-400"><span>12 работ ожидают проверки</span><span>Сегодня</span></div><button className="mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-body-sm font-bold text-white transition-colors hover:bg-brand-500">Открыть работы</button></article>
      </section>
    </>
  )
}
