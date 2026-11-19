import { HomePage } from '../pages/home/ui/HomePage'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'
import { useEffect, useState } from 'react'

export default function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return path === '/dashboard' || path.startsWith('/dashboard/')
    ? <DashboardPage path={path} />
    : <HomePage />
}
