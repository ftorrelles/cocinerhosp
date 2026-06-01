import { IconSun, IconMoon } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'

export default function ServicioToggle() {
  const servicio = useAppStore((s) => s.servicio)
  const setServicio = useAppStore((s) => s.setServicio)
  const isAlmuerzo = servicio === 'almuerzo'

  return (
    <div
      className="grid grid-cols-2 rounded-xl overflow-hidden border border-border"
      style={{ background: '#EEEDE8', gap: 0 }}
    >
      <button
        onClick={() => setServicio('almuerzo')}
        className="flex items-center justify-center gap-[7px] py-[11px] px-2 text-sm font-medium transition-all"
        style={{
          background: isAlmuerzo ? '#1B5E3F' : 'transparent',
          color: isAlmuerzo ? '#fff' : '#6B6860',
          borderRadius: 'calc(12px - 2px)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <IconSun size={18} />
        Almuerzo
      </button>
      <button
        onClick={() => setServicio('cena')}
        className="flex items-center justify-center gap-[7px] py-[11px] px-2 text-sm font-medium transition-all"
        style={{
          background: !isAlmuerzo ? '#1E3A5F' : 'transparent',
          color: !isAlmuerzo ? '#fff' : '#6B6860',
          borderRadius: 'calc(12px - 2px)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <IconMoon size={18} />
        Cena
      </button>
    </div>
  )
}
