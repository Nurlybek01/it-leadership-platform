import type { User as SupabaseUser } from '@supabase/supabase-js'

export type Role = 'student' | 'teacher'
export type AuthMode = 'login' | 'register'
export type User = { name: string; email: string; role: Role }

export const roleLabels: Record<Role, string> = {
  student: 'Студент',
  teacher: 'Преподаватель',
}

export function getRoleForEmail(email: string, selectedRole: Role = 'student'): Role {
  return email.trim().toLowerCase().endsWith('@teachers.tou.edu.kz') ? 'teacher' : selectedRole
}

export function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata
  const role = getRoleForEmail(supabaseUser.email ?? '', metadata.role === 'teacher' ? 'teacher' : 'student')

  return {
    name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || 'Пользователь',
    email: supabaseUser.email ?? '',
    role,
  }
}
