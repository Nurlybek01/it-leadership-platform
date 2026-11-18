import type { IconName } from '../../../shared/ui/Icon'

export const studentPages = [
  { id: 'home', label: 'Главная', path: '/dashboard', icon: 'spark' },
  { id: 'modules', label: 'Модули', path: '/dashboard/modules', icon: 'board' },
  { id: 'projects', label: 'Проекты', path: '/dashboard/projects', icon: 'target' },
  { id: 'team', label: 'Команда', path: '/dashboard/team', icon: 'users' },
  { id: 'achievements', label: 'Достижения', path: '/dashboard/achievements', icon: 'check' },
] as const satisfies readonly { id: string; label: string; path: string; icon: IconName }[]

export type StudentPage = (typeof studentPages)[number]['id']

export function getStudentPage(pathname: string): StudentPage {
  return studentPages.find((page) => page.path === pathname)?.id ?? 'home'
}
