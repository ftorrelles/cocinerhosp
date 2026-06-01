import { useAppStore } from '../../store/useAppStore'
import { PROTEINA_PRESETS } from '../../data/proteinaPresets'
import { detectarMerma } from '../../data/mermas'
import { IconMeat } from '@tabler/icons-react'

interface ProteinaSectionProps {
  platoId: string
}

export default function ProteinaSection({ platoId }: ProteinaSectionProps) {
  const plato = useAppStore((s) => s.platos.find((p) => p.id === platoId))
  const updatePlato = useAppStore((s) => s.updatePlato)

  if (!plato) return null

  const applyPreset = (preset: (typeof PROTEINA_PRESETS)[number]) => {
    updatePlato(platoId, {
      nombre: preset.nombre,
      unidadesPorCaja: preset.caja,
      unidadesPorRacion: preset.racion,
      nombreUnidad: preset.unidad,
    })
    // Auto-detect merma from preset name
    const m = detectarMerma(preset.nombre, 'prot')
    if (m.found) {
      updatePlato(platoId, {
        mermaProteina: m.merma,
        mermaProtAuto: true,
        mermaProtSource: m.source,
      })
    }
  }

  const handleMermaChange = (value: number) => {
    updatePlato(platoId, {
      mermaProteina: value,
      mermaProtAuto: false,
    })
  }

  return (
    <>
      <div className="sec-lbl">
        <IconMeat size={13} style={{ verticalAlign: -2 }} />
        {' Proteína — selección rápida'}
      </div>

      <div className="grid grid-cols-3 gap-[5px] mb-2">
        {PROTEINA_PRESETS.map((preset) => (
          <button
            key={preset.nombre}
            onClick={() => applyPreset(preset)}
            className="flex flex-col items-center py-2 px-1 text-[11px] text-center leading-tight border border-border rounded-sm bg-surface text-text2 cursor-pointer transition-all hover:bg-accent-light hover:border-accent hover:text-accent"
          >
            <IconMeat size={16} className="mb-[3px] text-text3" />
            {preset.nombre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[7px] mb-2">
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">Unid./caja</label>
          <input
            type="number"
            min={1}
            value={plato.unidadesPorCaja}
            onChange={(e) =>
              updatePlato(platoId, {
                unidadesPorCaja: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
          />
        </div>
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">Unid./ración</label>
          <input
            type="number"
            min={1}
            value={plato.unidadesPorRacion}
            onChange={(e) =>
              updatePlato(platoId, {
                unidadesPorRacion: parseInt(e.target.value) || 1,
              })
            }
            className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
          />
        </div>
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">Nombre unidad</label>
          <input
            type="text"
            value={plato.nombreUnidad}
            onChange={(e) =>
              updatePlato(platoId, { nombreUnidad: e.target.value })
            }
            className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
          />
        </div>
      </div>

      <div className="field">
        <label className="text-[11px] text-text2 block mb-[3px]">Merma proteína %</label>
        <div className="relative">
          <input
            type="number"
            min={-300}
            max={80}
            value={plato.mermaProteina}
            onChange={(e) => handleMermaChange(parseFloat(e.target.value) || 0)}
            className="w-full px-[10px] py-[7px] pr-12 text-sm border border-border rounded-sm bg-surface text-text"
            style={{ paddingRight: '48px' }}
          />
          <span
            className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[9px] font-semibold px-[5px] py-[2px] rounded-[6px] tracking-wide pointer-events-none"
            style={{
              background: plato.mermaProtAuto ? '#E8F3ED' : '#FEF3C7',
              color: plato.mermaProtAuto ? '#1B5E3F' : '#B45309',
            }}
          >
            {plato.mermaProtAuto ? 'auto' : 'manual'}
          </span>
        </div>
        <div className="text-[10px] text-text3 mt-[2px] italic leading-tight">
          {plato.mermaProtSource}
        </div>
      </div>
    </>
  )
}
