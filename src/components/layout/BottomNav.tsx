import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconCalculator,
  IconBowlSpoon,
  IconClipboardList,
  IconChartBar,
  IconUsers,
  IconBook,
} from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'

interface TabDef {
  to: string
  label: string
  icon: typeof IconCalculator
  adminOnly?: boolean
}

const ALL_TABS: TabDef[] = [
  { to: '/', label: 'Calcular', icon: IconCalculator },
  { to: '/recetas', label: 'Recetas', icon: IconBook },
  { to: '/blandas', label: 'Blandas', icon: IconBowlSpoon },
  { to: '/registrar', label: 'Registrar', icon: IconClipboardList },
  { to: '/dashboard', label: 'Dashboard', icon: IconChartBar },
  { to: '/usuarios', label: 'Usuarios', icon: IconUsers, adminOnly: true },
]

export default function BottomNav() {
  const user = useAppStore((s) => s.user)

  const tabs = useMemo(() => {
    if (user?.rol === 'admin') return ALL_TABS
    return ALL_TABS.filter((t) => !t.adminOnly)
  }, [user?.rol])

  return (
    <nav
      className="bg-surface border-t border-border grid shrink-0"
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center py-[10px] text-[11px] transition-colors border-t-2 ${
              isActive
                ? 'text-accent border-accent'
                : 'text-text3 border-transparent'
            }`
          }
        >
          <tab.icon size={20} className="mb-[2px]" />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
