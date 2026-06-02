import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <main className="px-4 py-[14px] pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
