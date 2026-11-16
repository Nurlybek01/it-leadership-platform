import type { FormEvent } from 'react'
import { roleLabels, type AuthMode, type Role } from '../../../entities/user/model/types'
import { Icon } from '../../../shared/ui/Icon'

type Props = {
  mode: AuthMode
  role: Role
  error: string
  isSubmitting: boolean
  isConfigured: boolean
  onClose: () => void
  onModeChange: (mode: AuthMode) => void
  onRoleChange: (role: Role) => void
  onSubmit: (email: string, password: string, name: string) => Promise<void>
  onGithub: () => void
  onClearError: () => void
}

export function AuthModal({ mode, role, error, isSubmitting, isConfigured, onClose, onModeChange, onRoleChange, onSubmit, onGithub, onClearError }: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const password = String(data.get('password') ?? '')
    const name = String(data.get('name') ?? '').trim()
    if (!email || !email.includes('@') || password.length < 6) {
      onClearError()
      return
    }
    void onSubmit(email, password, name)
  }

  return (
    <div aria-labelledby="auth-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm" role="dialog" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="relative w-full max-w-md animate-pop rounded-xl bg-white p-6 shadow-[var(--shadow-popover)] sm:p-8">
        <button aria-label="Закрыть" className="absolute right-5 top-5 text-2xl leading-none text-ink-400 transition-colors hover:text-ink-800" onClick={onClose}>×</button>
        <div className="flex size-11 items-center justify-center rounded-md bg-brand-50 text-brand-600"><Icon name="spark" /></div>
        <h2 className="mt-5 font-display text-heading-lg font-bold tracking-tight text-ink-950" id="auth-title">{mode === 'login' ? 'С возвращением' : 'Создайте профиль'}</h2>
        <p className="mt-2 max-w-sm text-body-sm text-ink-500">{mode === 'login' ? 'Войдите, чтобы продолжить свой путь развития.' : 'Выберите роль и начните развивать лидерские навыки.'}</p>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-md bg-ink-100 p-1">
          {(['student', 'teacher'] as Role[]).map((currentRole) => <button className={`rounded-sm px-3 py-2.5 text-body-sm font-semibold transition-colors ${role === currentRole ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'}`} key={currentRole} onClick={() => onRoleChange(currentRole)} type="button">{roleLabels[currentRole]}</button>)}
        </div>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && <label className="block text-body-sm font-semibold text-ink-700">Имя и фамилия<input autoComplete="name" className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" name="name" placeholder="Например, Анна Смирнова" required /></label>}
          <label className="block text-body-sm font-semibold text-ink-700">Email<input autoComplete="email" className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" name="email" placeholder="you@company.com" required type="email" /></label>
          <label className="block text-body-sm font-semibold text-ink-700">Пароль<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="mt-1.5 w-full rounded-md border border-[var(--color-border)] px-3.5 py-3 font-normal outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" minLength={6} name="password" placeholder="Минимум 6 символов" required type="password" /></label>
          {error && <p className="rounded-md bg-danger-50 px-3 py-2 text-body-xs font-medium text-danger-600" role="alert">{error}</p>}
          <button className="w-full rounded-md bg-brand-600 px-4 py-3.5 text-body-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || !isConfigured} type="submit">{isSubmitting ? 'Подождите...' : mode === 'login' ? 'Войти в Leadcraft' : 'Создать профиль'}</button>
        </form>
        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-ink-400"><span className="h-px flex-1 bg-ink-200" />или<span className="h-px flex-1 bg-ink-200" /></div>
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-4 py-3 text-body-sm font-bold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || !isConfigured} onClick={onGithub} type="button">Войти через GitHub</button>
        <p className="mt-5 text-center text-body-xs text-ink-500">{mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}<button className="font-bold text-brand-600 hover:text-brand-700" onClick={() => { onModeChange(mode === 'login' ? 'register' : 'login'); onClearError() }} type="button">{mode === 'login' ? 'Зарегистрироваться' : 'Войти'}</button></p>
        {!isConfigured && <p className="mt-4 rounded-md bg-warning-50 px-3 py-2 text-center text-[10px] font-medium text-warning-600">Добавьте Supabase-переменные окружения, чтобы включить авторизацию.</p>}
      </div>
    </div>
  )
}
