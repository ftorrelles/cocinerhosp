import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBuildingHospital, IconLogout, IconUserCircle } from '@tabler/icons-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore } from '../../store/useAppStore'
import { useAuth } from '../../hooks/useAuth'

export default function TopBar() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [dateStr, setDateStr] = useState(() => getFormattedDate())
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    const tick = () => setDateStr(getFormattedDate())

    document.addEventListener('visibilitychange', tick)

    const interval = setInterval(tick, 60_000)

    return () => {
      document.removeEventListener('visibilitychange', tick)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-accent text-white px-4 py-[14px] flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <IconBuildingHospital size={20} />
        <div>
          <p className="text-base font-semibold leading-tight">CocinerHosp</p>
          {user && (
            <p className="text-[11px] font-mono opacity-75 leading-tight">
              Hola, {user.nombre_completo.split(' ')[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <time className="text-[11px] font-mono opacity-75">{dateStr}</time>
        <button
          onClick={() => navigate('/perfil')}
          className="flex items-center justify-center w-[30px] h-[30px] rounded-sm opacity-70 hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
          title="Perfil"
        >
          <IconUserCircle size={18} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-[30px] h-[30px] rounded-sm opacity-70 hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
          title="Cerrar sesión"
        >
          <IconLogout size={18} />
        </button>
      </div>
    </header>
  )
}

function getFormattedDate(): string {
  const now = new Date()
  const dayAbbr = format(now, 'EEE', { locale: es })
  const dayNum = format(now, 'd')
  const monthAbbr = format(now, 'MMM', { locale: es })
  return `${dayAbbr} ${dayNum} ${monthAbbr}`
}
