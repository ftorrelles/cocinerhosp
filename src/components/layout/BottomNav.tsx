import { NavLink } from 'react-router-dom'
import {
  IconCalculator,
  IconBowlSpoon,
  IconClipboardList,
  IconChartBar,
} from '@tabler/icons-react'

const tabs = [
  { to: '/', label: 'Calcular', icon: IconCalculator },
  { to: '/blandas', label: 'Blandas', icon: IconBowlSpoon },
  { to: '/registrar', label: 'Registrar', icon: IconClipboardList },
  { to: '/dashboard', label: 'Dashboard', icon: IconChartBar },
] as const

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-100 bg-surface border-t border-border grid grid-cols-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
