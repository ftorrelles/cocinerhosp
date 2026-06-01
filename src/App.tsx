import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Calcular from './pages/Calcular'
import Blandas from './pages/Blandas'
import ProtectedLayout from './components/layout/ProtectedLayout'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-text3">
      <p className="text-base font-medium">{title}</p>
      <p className="text-sm mt-1">Pantalla en construcción</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Calcular />} />
        <Route path="/blandas" element={<Blandas />} />
        <Route
          path="/registrar"
          element={<PlaceholderPage title="Registrar" />}
        />
        <Route
          path="/dashboard"
          element={<PlaceholderPage title="Dashboard" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
