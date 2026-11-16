import type { User } from '../../../entities/user/model/types'
import { roleLabels } from '../../../entities/user/model/types'
import { Icon } from '../../../shared/ui/Icon'

export function Header({ user, onLogin, onLogout }: { user: User | null; onLogin: () => void; onLogout: () => void }) {
  return (
    <nav className="mx-auto flex max-w-[var(--spacing-content)] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <a className="flex items-center gap-2.5" href="#">
        <span className="flex size-9 items-center justify-center rounded-md bg-brand-600 text-white shadow-glow"><Icon name="spark" className="size-5" /></span>
        <span className="font-display text-heading-sm font-bold tracking-tight text-ink-900">Lead<span className="text-brand-600">craft</span></span>
      </a>
      <div className="hidden items-center gap-8 text-body-sm font-medium text-ink-600 md:flex">
        <a className="transition-colors hover:text-brand-600" href="#about">О платформе</a>
        <a className="transition-colors hover:text-brand-600" href="#program">Программа</a>
        <a className="transition-colors hover:text-brand-600" href="#community">Сообщество</a>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"><p className="text-body-xs font-bold text-ink-800">{user.name}</p><p className="text-[10px] text-ink-500">{roleLabels[user.role]}</p></div>
          <button aria-label="Выйти из аккаунта" className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-body-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-600" onClick={onLogout}>Выйти</button>
        </div>
      ) : <button className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-body-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-600" onClick={onLogin}>Войти</button>}
    </nav>
  )
}
