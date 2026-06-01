import { IconX, IconPlus, IconMinus } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { detectarMerma } from '../../data/mermas'
import ProteinaSection from './ProteinaSection'
import GuarnicionSection from './GuarnicionSection'

interface PlatoItemProps {
  platoId: string
}

export default function PlatoItem({ platoId }: PlatoItemProps) {
  const plato = useAppStore((s) => s.platos.find((p) => p.id === platoId))
  const removePlato = useAppStore((s) => s.removePlato)
  const updatePlato = useAppStore((s) => s.updatePlato)
  const toggleGuar2 = useAppStore((s) => s.toggleGuar2)

  if (!plato) return null

  const handleNameChange = (nombre: string) => {
    updatePlato(platoId, { nombre })
    // Also try to detect protein merma from the plato name
    const m = detectarMerma(nombre, 'prot')
    if (m.found) {
      updatePlato(platoId, {
        mermaProteina: m.merma,
        mermaProtAuto: true,
        mermaProtSource: m.source,
      })
    }
  }

  return (
    <div className="bg-surface2 border border-border rounded-sm mb-[10px] overflow-hidden">
      <div className="bg-surface px-3 py-[10px] flex items-center gap-2 border-b border-border">
        <input
          type="text"
          placeholder="Nombre del plato"
          value={plato.nombre}
          onChange={(e) => handleNameChange(e.target.value)}
          className="flex-1 text-sm font-semibold border-none bg-transparent text-text placeholder:text-text3 min-w-0 outline-none"
        />
        <button
          onClick={() => removePlato(platoId)}
          className="px-2 py-1 text-xs bg-transparent border border-border rounded-[6px] text-text3 cursor-pointer flex-shrink-0"
        >
          <IconX size={13} />
        </button>
      </div>

      <div className="p-3">
        <ProteinaSection platoId={platoId} />

        <div className="h-[1px] bg-border my-[10px]" />

        <GuarnicionSection platoId={platoId} numero={1} />

        <div
          id={`g2bloque-${platoId}`}
          style={{ display: plato.guar2Activa ? 'block' : 'none' }}
        >
          <div className="h-[1px] bg-border my-[10px]" />
          <GuarnicionSection platoId={platoId} numero={2} />
        </div>

        <button
          onClick={() => toggleGuar2(platoId)}
          className="w-full py-[7px] text-xs bg-transparent border border-dashed border-border rounded-sm text-accent cursor-pointer mt-1"
        >
          {plato.guar2Activa ? (
            <>
              <IconMinus size={12} style={{ verticalAlign: -1 }} /> Quitar segunda guarnición
            </>
          ) : (
            <>
              <IconPlus size={12} style={{ verticalAlign: -1 }} /> + Añadir segunda guarnición
            </>
          )}
        </button>
      </div>
    </div>
  )
}
