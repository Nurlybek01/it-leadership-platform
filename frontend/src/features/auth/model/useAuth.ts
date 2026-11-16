import { useEffect, useState } from 'react'
import { getRoleForEmail, mapSupabaseUser, type AuthMode, type Role, type User } from '../../../entities/user/model/types'
import { isSupabaseConfigured, supabase } from '../../../shared/config/supabase'
import { navigate } from '../../../shared/lib/router'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [role, setRole] = useState<Role>('student')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReady, setIsReady] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setFormError(error.message)
        setIsReady(true)
        return
      }
      const nextUser = data.session?.user ? mapSupabaseUser(data.session.user) : null
      setUser(nextUser)
      if (nextUser && window.location.pathname !== '/dashboard') navigate('/dashboard')
      setIsReady(true)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ? mapSupabaseUser(session.user) : null
      setUser(nextUser)
      if (nextUser && window.location.pathname !== '/dashboard') navigate('/dashboard')
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setFormError('')
    setAuthOpen(true)
  }

  const submitAuth = async (email: string, password: string, name: string) => {
    if (!supabase) {
      setFormError('Supabase не настроен. Добавьте переменные окружения.')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    const result = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { name, role: getRoleForEmail(email, role) } } })

    setIsSubmitting(false)
    if (result.error) {
      setFormError(result.error.message)
      return
    }

    if (authMode === 'register' && !result.data.session) {
      setFormError('Проверьте почту и подтвердите email, чтобы завершить регистрацию.')
      return
    }
    setAuthOpen(false)
  }

  const signInWithGithub = async () => {
    if (!supabase) {
      setFormError('Supabase не настроен. Добавьте переменные окружения.')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setIsSubmitting(false)
      setFormError(error.message)
    }
  }

  const logout = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setFormError(error.message)
    else navigate('/')
  }

  return {
    user, authMode, authOpen, role, formError, isSubmitting, isReady,
    isSupabaseConfigured, setAuthMode, setAuthOpen, setRole, setFormError,
    openAuth, submitAuth, signInWithGithub, logout,
  }
}
