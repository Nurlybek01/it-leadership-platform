import { AuthModal } from '../../../features/auth/ui/AuthModal'
import { useAuth } from '../../../features/auth/model/useAuth'
import { Header } from '../../../widgets/header/ui/Header'
import { Hero } from '../../../widgets/hero/ui/Hero'
import { LandingSections } from '../../../widgets/landing/ui/LandingSections'

export function HomePage() {
  const auth = useAuth()
  const openRegister = () => auth.openAuth('register')
  const openLogin = () => auth.openAuth('login')

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header user={auth.user} onLogin={openLogin} onLogout={() => void auth.logout()} />
      <Hero isAuthenticated={Boolean(auth.user)} onStart={openRegister} />
      <LandingSections onStart={openRegister} />
      {auth.authOpen && <AuthModal mode={auth.authMode} role={auth.role} error={auth.formError} isSubmitting={auth.isSubmitting} isConfigured={auth.isSupabaseConfigured} onClose={() => auth.setAuthOpen(false)} onModeChange={auth.setAuthMode} onRoleChange={auth.setRole} onSubmit={auth.submitAuth} onGithub={() => void auth.signInWithGithub()} onClearError={() => auth.setFormError('')} />}
      <footer className="mx-auto flex max-w-[var(--spacing-content)] flex-col gap-4 px-5 py-10 text-body-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><div className="flex items-center gap-2 font-semibold text-ink-600"><span className="flex size-6 items-center justify-center rounded-xs bg-brand-600 text-white"><span className="text-xs">✦</span></span>Leadcraft</div><p>© 2026 Leadcraft. Развивайте лидерство осознанно.</p></footer>
    </main>
  )
}
