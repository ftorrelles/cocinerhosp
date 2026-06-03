import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Calcular from './pages/Calcular'
import Blandas from './pages/Blandas'
import Registrar from './pages/Registrar'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import Usuarios from './pages/Usuarios'
import ProtectedLayout from './components/layout/ProtectedLayout'
import AdminRoute from './components/layout/AdminRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Calcular />} />
        <Route path="/blandas" element={<Blandas />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />

        <Route element={<AdminRoute />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
