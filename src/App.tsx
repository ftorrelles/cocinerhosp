import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Calcular from './pages/Calcular'
import Blandas from './pages/Blandas'
import Registrar from './pages/Registrar'
import Dashboard from './pages/Dashboard'
import ProtectedLayout from './components/layout/ProtectedLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Calcular />} />
        <Route path="/blandas" element={<Blandas />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
