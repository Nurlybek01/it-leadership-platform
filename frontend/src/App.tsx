import { useState } from 'react'

type IconName = 'arrow' | 'check' | 'spark' | 'users' | 'target' | 'board' | 'chat' | 'play'

function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    spark: <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Zm6 12 0.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87m-1-8a4 4 0 0 1 0 7.75" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    board: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11M15 9v11" /></>,
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.5-4A8.3 8.3 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    play: <path d="m9 6 9 6-9 6V6Z" />,
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  )
}

const features = [
  { icon: 'target' as IconName, title: 'Практика, а не лекции', text: 'Решайте реальные лидерские кейсы и сразу применяйте новые подходы в работе.' },
  { icon: 'users' as IconName, title: 'Сила команды', text: 'Обменивайтесь опытом, получайте обратную связь и растите вместе с коллегами.' },
  { icon: 'board' as IconName, title: 'Прогресс на виду', text: 'Понятная карта развития, уровни и достижения помогают не сбиться с пути.' },
]

const modules = [
  { number: '01', title: 'Осознанное лидерство', text: 'Познайте свои сильные стороны и сформируйте личный стиль управления.', color: 'bg-brand-500' },
  { number: '02', title: 'Коммуникация', text: 'Учитесь давать обратную связь, вести сложные разговоры и вдохновлять.', color: 'bg-accent-500' },
  { number: '03', title: 'Команды и результат', text: 'Создавайте среду, где люди раскрываются, а цели достигаются.', color: 'bg-success-500' },
]

type Role = 'student' | 'teacher'
type AuthMode = 'login' | 'register'
type User = { name: string; email: string; role: Role }

const roleLabels: Record<Role, string> = {
  student: 'Студент',
  teacher: 'Преподаватель',
}

function getStoredUser(): User | null {
  const storedUser = localStorage.getItem('leadcraft-user')
  if (!storedUser) return null

  try {
    const user = JSON.parse(storedUser) as User
    return user.name && user.email && user.role ? user : null
  } catch {
    return null
  }
}

function App() {
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [role, setRole] = useState<Role>('student')
  const [formError, setFormError] = useState('')

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setFormError('')
    setAuthOpen(true)
  }

  const handleAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    const name = String(formData.get('name') ?? '').trim()

    if (!email || !email.includes('@') || password.length < 6) {
      setFormError('Введите корректный email и пароль минимум из 6 символов.')
      return
    }

    if (authMode === 'register' && !name) {
      setFormError('Введите имя, чтобы создать профиль.')
      return
    }

    const nextUser: User = {
      name: name || email.split('@')[0],
      email,
      role,
    }
    localStorage.setItem('leadcraft-user', JSON.stringify(nextUser))
    setUser(nextUser)
    setAuthOpen(false)
    setFormError('')
  }

  const logout = () => {
    localStorage.removeItem('leadcraft-user')
    setUser(null)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <nav className="mx-auto flex max-w-[var(--spacing-content)] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a className="flex items-center gap-2.5" href="#">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand-600 text-white shadow-glow">
            <Icon name="spark" className="size-5" />
          </span>
          <span className="font-display text-heading-sm font-bold tracking-tight text-ink-900">Lead<span className="text-brand-600">craft</span></span>
        </a>
        <div className="hidden items-center gap-8 text-body-sm font-medium text-ink-600 md:flex">
          <a className="transition-colors hover:text-brand-600" href="#about">О платформе</a>
          <a className="transition-colors hover:text-brand-600" href="#program">Программа</a>
          <a className="transition-colors hover:text-brand-600" href="#community">Сообщество</a>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-body-xs font-bold text-ink-800">{user.name}</p>
              <p className="text-[10px] text-ink-500">{roleLabels[user.role]}</p>
            </div>
            <button aria-label="Выйти из аккаунта" className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-body-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-600" onClick={logout}>
              Выйти
            </button>
          </div>
        ) : (
          <button className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-body-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-600" onClick={() => openAuth('login')}>
            Войти
          </button>
        )}
      </nav>

      <section className="relative mx-auto grid max-w-[var(--spacing-content)] items-center gap-12 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-24">
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
            Интерактивная платформа, которая превращает развитие лидерских навыков в увлекательный командный квест.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3.5 text-body-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 hover:bg-brand-700" onClick={() => openAuth('register')}>
              {user ? 'Открыть свой путь' : 'Начать путь бесплатно'}
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-md border border-(--color-border) bg-white px-5 py-3.5 text-body-sm font-bold text-ink-700 transition-all hover:border-brand-300 hover:text-brand-600">
              <Icon name="play" className="size-4 fill-current" />
              Смотреть демо
            </button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-body-xs text-ink-500">
            <div className="flex -space-x-2">
              {['bg-brand-300', 'bg-accent-300', 'bg-warning-500', 'bg-success-500'].map((color, index) => <span className={`flex size-7 items-center justify-center rounded-full border-2 border-[var(--color-bg)] ${color} text-[10px] font-bold text-white`} key={color}> {['AK', 'МР', 'ИВ', 'СН'][index]} </span>)}
            </div>
            <span><strong className="text-ink-800">2 400+</strong> специалистов уже развиваются</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-pop lg:ml-auto">
          <div className="absolute -right-10 -top-10 size-52 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="absolute -bottom-8 -left-10 size-48 rounded-full bg-accent-200/60 blur-3xl" />
          <div className="relative rounded-xl border border-white/80 bg-white p-3 shadow-[var(--shadow-popover)]">
            <div className="overflow-hidden rounded-lg bg-ink-950">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2 text-body-xs font-semibold text-white/80"><span className="size-2 rounded-full bg-success-500" />Мой путь</div>
                <span className="rounded-pill bg-brand-500/20 px-2.5 py-1 text-[10px] font-bold text-brand-300">УРОВЕНЬ 04</span>
              </div>
              <div className="p-5">
                <div className="flex items-end justify-between">
                  <div><p className="text-body-xs text-ink-400">Текущий прогресс</p><p className="mt-1 text-data-xl font-bold text-white">68%</p></div>
                  <span className="mb-1 text-body-xs font-semibold text-success-400">+12% за неделю</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-pill bg-white/10"><div className="h-full w-[68%] rounded-pill bg-gradient-to-r from-brand-500 to-accent-400" /></div>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  {[['12', 'Заданий'], ['04', 'Команд'], ['08', 'Бейджей']].map(([value, label]) => <div className="rounded-md border border-white/10 bg-white/5 p-3" key={label}><p className="text-data-md font-bold text-white">{value}</p><p className="mt-1 text-[10px] text-ink-400">{label}</p></div>)}
                </div>
                <div className="mt-6 rounded-lg bg-brand-600 p-4">
                  <div className="flex items-center justify-between"><span className="text-body-xs font-semibold text-brand-100">Следующий челлендж</span><span className="text-lg">✦</span></div>
                  <p className="mt-2 text-body-sm font-bold text-white">Сложный разговор</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-brand-200"><span>+250 XP</span><span>15 мин</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-5 hidden items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-card)] sm:flex">
            <span className="flex size-9 items-center justify-center rounded-md bg-warning-50 text-lg">🏆</span>
            <div><p className="text-[10px] font-medium text-ink-500">Новое достижение</p><p className="text-body-xs font-bold text-ink-800">Командный игрок</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white" id="about">
        <div className="mx-auto grid max-w-[var(--spacing-content)] gap-6 px-5 py-8 sm:px-8 md:grid-cols-3 md:px-10 md:py-10">
          {features.map(({ icon, title, text }) => <div className="flex gap-4" key={title}><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600"><Icon name={icon} /></span><div><h2 className="text-body-md font-bold text-ink-900">{title}</h2><p className="mt-1 text-body-sm text-ink-500">{text}</p></div></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-[var(--spacing-content)] px-5 py-[var(--spacing-section)] sm:px-8 lg:px-10" id="program">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="text-label font-bold uppercase text-brand-600">Как это работает</p><h2 className="mt-3 max-w-xl font-display text-heading-xl font-bold tracking-tight text-ink-950 sm:text-display-md">Расти проще, когда видишь следующий шаг</h2></div>
          <p className="max-w-sm text-body-sm leading-relaxed text-ink-500">Три направления, десятки практических заданий и команда, которая помогает двигаться вперёд.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {modules.map((module, index) => <article className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]" key={module.number}><div className="flex items-center justify-between"><span className={`flex size-10 items-center justify-center rounded-md ${module.color} text-body-sm font-bold text-white`}>{module.number}</span><span className="text-body-xs font-semibold text-ink-400">0{index + 1} / 03</span></div><h3 className="mt-12 text-heading-md font-bold text-ink-900">{module.title}</h3><p className="mt-3 text-body-sm leading-relaxed text-ink-500">{module.text}</p><div className="mt-6 flex items-center gap-2 text-body-xs font-bold text-brand-600">Подробнее <Icon name="arrow" className="size-3.5 transition-transform group-hover:translate-x-1" /></div></article>)}
        </div>
      </section>

      <section className="mx-5 overflow-hidden rounded-2xl bg-brand-600 sm:mx-8 lg:mx-auto lg:max-w-[var(--spacing-content)]" id="community">
        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1fr_auto] md:px-16 md:py-16">
          <div className="absolute -right-20 -top-32 size-80 rounded-full border-[40px] border-white/5" />
          <div className="relative"><p className="text-label font-bold uppercase text-brand-200">Твой следующий уровень</p><h2 className="mt-3 max-w-2xl font-display text-heading-xl font-bold tracking-tight text-white sm:text-display-md">Станьте лидером, за которым хотят идти</h2><p className="mt-4 max-w-xl text-body-md text-brand-100">Присоединяйтесь к сообществу IT-специалистов, которые растут осознанно и влияют на результат.</p></div>
          <button className="relative inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3.5 text-body-sm font-bold text-brand-700 transition-transform hover:-translate-y-0.5" onClick={() => openAuth('register')}>Попробовать бесплатно <Icon name="arrow" className="size-4" /></button>
        </div>
      </section>

      {authOpen && (
        <div aria-labelledby="auth-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm" role="dialog" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAuthOpen(false)
        }}>
          <div className="relative w-full max-w-md animate-pop rounded-xl bg-white p-6 shadow-[var(--shadow-popover)] sm:p-8">
            <button aria-label="Закрыть" className="absolute right-5 top-5 text-2xl leading-none text-ink-400 transition-colors hover:text-ink-800" onClick={() => setAuthOpen(false)}>×</button>
            <div className="flex size-11 items-center justify-center rounded-md bg-brand-50 text-brand-600"><Icon name="spark" /></div>
            <h2 className="mt-5 font-display text-heading-lg font-bold tracking-tight text-ink-950" id="auth-title">{authMode === 'login' ? 'С возвращением' : 'Создайте профиль'}</h2>
            <p className="mt-2 max-w-sm text-body-sm text-ink-500">{authMode === 'login' ? 'Войдите, чтобы продолжить свой путь развития.' : 'Выберите роль и начните развивать лидерские навыки.'}</p>
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-md bg-ink-100 p-1">
              {(['student', 'teacher'] as Role[]).map((currentRole) => (
                <button className={`rounded-sm px-3 py-2.5 text-body-sm font-semibold transition-colors ${role === currentRole ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'}`} key={currentRole} onClick={() => setRole(currentRole)} type="button">
                  {roleLabels[currentRole]}
                </button>
              ))}
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleAuth}>
              {authMode === 'register' && <label className="block text-body-sm font-semibold text-ink-700">Имя и фамилия<input autoComplete="name" className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" name="name" placeholder="Например, Анна Смирнова" /></label>}
              <label className="block text-body-sm font-semibold text-ink-700">Email<input autoComplete="email" className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" name="email" placeholder="you@company.com" required type="email" /></label>
              <label className="block text-body-sm font-semibold text-ink-700">Пароль<input autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" minLength={6} name="password" placeholder="Минимум 6 символов" required type="password" /></label>
              {formError && <p className="rounded-md bg-danger-50 px-3 py-2 text-body-xs font-medium text-danger-600" role="alert">{formError}</p>}
              <button className="w-full rounded-md bg-brand-600 px-4 py-3.5 text-body-sm font-bold text-white transition-colors hover:bg-brand-700" type="submit">{authMode === 'login' ? 'Войти в Leadcraft' : 'Создать профиль'}</button>
            </form>
            <p className="mt-5 text-center text-body-xs text-ink-500">
              {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button className="font-bold text-brand-600 hover:text-brand-700" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setFormError('') }} type="button">
                {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
            <p className="mt-4 text-center text-[10px] text-ink-400">Демо-режим: данные сохраняются только в этом браузере.</p>
          </div>
        </div>
      )}

      <footer className="mx-auto flex max-w-[var(--spacing-content)] flex-col gap-4 px-5 py-10 text-body-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="flex items-center gap-2 font-semibold text-ink-600"><span className="flex size-6 items-center justify-center rounded-xs bg-brand-600 text-white"><Icon name="spark" className="size-3.5" /></span>Leadcraft</div>
        <p>© 2026 Leadcraft. Развивайте лидерство осознанно.</p>
      </footer>
    </main>
  )
}

export default App
