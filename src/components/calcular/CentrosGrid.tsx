import { IconUsers } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { CENTROS } from '../../data/centros'

export default function CentrosGrid() {
  const servicio = useAppStore((s) => s.servicio)
  const pacientes = useAppStore((s) => s.pacientes)
  const setPaciente = useAppStore((s) => s.setPaciente)

  const total = Object.values(pacientes).reduce((a, b) => a + b, 0)
  const barColor = servicio === 'almuerzo' ? '#1B5E3F' : '#1E3A5F'
  const servicioLabel = servicio === 'almuerzo' ? 'Almuerzo' : 'Cena'

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-1">
        {CENTROS.map((centro) => (
          <div key={centro.id}>
            <div className="flex items-center gap-1 text-[11px] text-text2 mb-[3px]">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: centro.color }}
              />
              {centro.nombre}
            </div>
            <input
              type="number"
              min={0}
              value={pacientes[centro.id] ?? 0}
              onChange={(e) =>
                setPaciente(centro.id, parseInt(e.target.value) || 0)
              }
              className="w-full px-[10px] py-[7px] text-[15px] font-mono font-medium text-center border border-border rounded-sm bg-surface text-text"
            />
          </div>
        ))}
      </div>

      <div
        className="flex justify-between items-center rounded-sm px-[14px] py-[10px] mt-[6px] text-white"
        style={{ background: barColor }}
      >
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ opacity: 0.75 }}
          >
            {servicioLabel}
          </div>
          <div className="text-xs" style={{ opacity: 0.8 }}>
            Total pacientes
          </div>
          <div
            className="text-[28px] font-semibold font-mono leading-none mt-1"
            style={{ fontWeight: 600 }}
          >
            {total}
          </div>
        </div>
        <IconUsers size={28} style={{ opacity: 0.5 }} />
      </div>
    </>
  )
}
