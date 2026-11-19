import { Suspense, lazy, useEffect } from 'react'
import { useAuth } from '../../../features/auth/model/useAuth'
import { roleLabels } from '../../../entities/user/model/types'
import { navigate } from '../../../shared/lib/router'
import { Icon } from '../../../shared/ui/Icon'
import { AchievementsPage } from '../../student/achievements/ui/AchievementsPage'
import { StudentHomePage } from '../../student/home/ui/StudentHomePage'
import { ProjectsPage } from '../../student/projects/ui/ProjectsPage'
import { TeamPage } from '../../student/team/ui/TeamPage'
import { getStudentPage } from '../../student/model/routes'
import { StudentSidebar } from '../../../widgets/student-dashboard/ui/StudentSidebar'
import { TeacherDashboard } from '../../../widgets/teacher-dashboard/ui/TeacherDashboard'

const ModulesPage = lazy(() =>
  import('../../student/modules/ui/ModulesPage').then((module) => ({ default: module.ModulesPage })),
)

export function DashboardPage({ path }: { path: string }) {
  const auth = useAuth()
  const studentPage = getStudentPage(path)

  useEffect(() => {
    if (auth.isReady && !auth.user) navigate('/')
  }, [auth.isReady, auth.user])

  if (!auth.isReady || !auth.user) return null

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="flex items-center justify-between px-3 py-4 sm:px-5 lg:px-7">
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

      <div className="w-full px-3 py-6 sm:px-5 sm:py-8 lg:px-7 lg:py-10">
        <div className={auth.user.role === 'student' ? 'grid items-stretch gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-7' : ''}>
          {auth.user.role === 'teacher'
            ? <TeacherDashboard name={auth.user.name} />
            : <>
                <StudentSidebar activePage={studentPage} />
                <div className="min-w-0">
                  {studentPage === 'home' && <StudentHomePage user={auth.user} />}
                  {studentPage === 'modules' && (
                    <Suspense fallback={<p className="text-body-sm text-ink-500" role="status">Загружаем модули…</p>}>
                      <ModulesPage path={path} />
                    </Suspense>
                  )}
                  {studentPage === 'projects' && <ProjectsPage />}
                  {studentPage === 'team' && <TeamPage user={auth.user} />}
                  {studentPage === 'achievements' && <AchievementsPage />}
                </div>
              </>}
        </div>
      </div>
    </main>
  )
}
