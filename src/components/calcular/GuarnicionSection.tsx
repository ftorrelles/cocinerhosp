import { useAppStore } from '../../store/useAppStore'
import { GUARNICION_PRESETS } from '../../data/guarnicionPresets'
import { detectarMerma } from '../../data/mermas'
import { IconSnowflake } from '@tabler/icons-react'

interface GuarnicionSectionProps {
  platoId: string
  numero: 1 | 2
}

export default function GuarnicionSection({
  platoId,
  numero,
}: GuarnicionSectionProps) {
  const plato = useAppStore((s) => s.platos.find((p) => p.id === platoId))
  const updatePlato = useAppStore((s) => s.updatePlato)

  if (!plato) return null

  const prefix = numero === 1 ? 'guar1' : 'guar2'

  const nombre = plato[`${prefix}Nombre`]
  const bolsaKg = plato[`${prefix}BolsaKg`]
  const merma = plato[`${prefix}Merma`]
  const mermaAuto = plato[`${prefix}MermaAuto`]
  const mermaSource = plato[`${prefix}MermaSource`]
  const gramos = plato[`${prefix}Gramos`]

  const setField = (field: string, value: string | number | boolean) => {
    updatePlato(platoId, { [`${prefix}${field}`]: value } as Record<string, unknown>)
  }

  const handleNameChange = (value: string) => {
    setField('Nombre', value)
    const m = detectarMerma(value, 'guar')
    if (m.found) {
      updatePlato(platoId, {
        [`${prefix}Merma`]: m.merma,
        [`${prefix}MermaAuto`]: true,
        [`${prefix}MermaSource`]: m.source,
      } as Record<string, unknown>)
    }
  }

  const handleMermaChange = (value: number) => {
    updatePlato(platoId, {
      [`${prefix}Merma`]: value,
      [`${prefix}MermaAuto`]: false,
    } as Record<string, unknown>)
  }

  return (
    <>
      <div className="sec-lbl">
        <IconSnowflake size={13} style={{ verticalAlign: -2 }} />
        {` Guarnición ${numero}`}
      </div>

      <div className="flex flex-wrap gap-[5px] mb-2">
        {GUARNICION_PRESETS.map((g) => (
          <button
            key={g}
            onClick={() => handleNameChange(g)}
            className="px-[10px] py-[4px] text-xs border border-border rounded-[20px] cursor-pointer bg-surface text-text2 transition-all hover:bg-accent-light hover:text-accent hover:border-accent"
            style={
              nombre === g
                ? { background: '#1B5E3F', color: '#fff', borderColor: '#1B5E3F' }
                : {}
            }
          >
            {g}
          </button>
        ))}
      </div>

      <div className="field">
        <label className="text-[11px] text-text2 block mb-[3px]">Nombre</label>
        <input
          type="text"
          placeholder="Ej: Habichuelas, Arroz..."
          value={nombre}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3"
        />
      </div>

      <div className="grid grid-cols-3 gap-[7px] mb-2">
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">Bolsa (kg)</label>
          <input
            type="number"
            min={0.1}
            step={0.5}
            value={bolsaKg}
            onChange={(e) => setField('BolsaKg', parseFloat(e.target.value) || 2.5)}
            className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
          />
        </div>
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">Merma %</label>
          <div className="relative">
            <input
              type="number"
              min={-300}
              max={80}
              value={merma}
              onChange={(e) => handleMermaChange(parseFloat(e.target.value) || 0)}
              className="w-full px-[10px] py-[7px] pr-12 text-sm border border-border rounded-sm bg-surface text-text"
              style={{ paddingRight: '48px' }}
            />
            <span
              className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[9px] font-semibold px-[5px] py-[2px] rounded-[6px] tracking-wide pointer-events-none"
              style={{
                background: mermaAuto ? '#E8F3ED' : '#FEF3C7',
                color: mermaAuto ? '#1B5E3F' : '#B45309',
              }}
            >
              {mermaAuto ? 'auto' : 'manual'}
            </span>
          </div>
        </div>
        <div className="field">
          <label className="text-[11px] text-text2 block mb-[3px]">g netos/rac.</label>
          <input
            type="number"
            min={1}
            value={gramos}
            onChange={(e) => setField('Gramos', parseInt(e.target.value) || 60)}
            className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
          />
        </div>
      </div>

      <div className="text-[10px] text-text3 mt-[2px] italic leading-tight mb-2">
        {mermaSource || 'Escribí el nombre para autocompletar'}
      </div>
    </>
  )
}
