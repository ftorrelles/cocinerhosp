import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export default function AdminRoute() {
  const user = useAppStore((s) => s.user)

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
