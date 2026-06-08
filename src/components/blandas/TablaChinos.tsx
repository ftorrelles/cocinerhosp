import { useState } from 'react'
import { IconSoup, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { useHistorial } from '../../hooks/useHistorial'
import { CHINOS, CHINOS_BARQUETAS, CHINOS_KG_BARQUETA, CHINOS_TOTAL_KG } from '../../data/blandas'

export default function TablaChinos() {
  const user = useAppStore((s) => s.user)
  const servicio = useAppStore((s) => s.servicio)
  const { addRegistro } = useHistorial(user?.id)
  const [gastros, setGastros] = useState('')
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = async () => {
    const g = parseInt(gastros) || 0
    if (g < 1) return
    const barquetas = g * 6
    const r = await addRegistro({
      plato: 'Blandas - Chinos',
      servicio: servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
      raciones: barquetas,
      categoria: 'blandas',
    })
    if (!r.error) {
      setGuardado(true)
      setGastros('')
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
        <IconSoup size={17} className="text-accent" />
        <span>
          Chinos{' '}
          <span className="font-normal text-text2 text-xs">
            — {CHINOS_BARQUETAS} barquetas × {CHINOS_KG_BARQUETA} kg = {CHINOS_TOTAL_KG} kg/día
          </span>
        </span>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-text2 font-semibold leading-loose">
            <th className="text-left font-medium">Tipo</th>
            <th className="text-left font-medium">Ingredientes</th>
            <th className="text-center font-medium">Bolsas</th>
            <th className="text-right font-medium">Bruto</th>
          </tr>
        </thead>
        <tbody>
          {CHINOS.map((c, i) => (
            <tr key={c.tipo} className={i % 2 === 1 ? 'bg-surface2 rounded' : ''}>
              <td className="py-[6px] text-text font-medium">{c.tipo}</td>
              <td className="py-[6px] text-text2">{c.ingredientes}</td>
              <td className="py-[6px] text-center font-mono text-sm font-medium text-text">{c.bolsas}</td>
              <td className="py-[6px] text-right font-mono text-sm font-medium text-text">{c.brutoKg} kg</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 pt-3 border-t border-border">
        <label className="text-[11px] text-text2 block mb-[3px]">
          Gastros producidos (1 gastro = 6 barquetas)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={gastros}
            onChange={(e) => { setGuardado(false); setGastros(e.target.value) }}
            className="flex-1 px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
          />
          <button
            onClick={handleGuardar}
            disabled={!gastros || parseInt(gastros) < 1}
            className="px-3 py-[7px] text-xs font-semibold text-white border-none rounded-sm cursor-pointer disabled:opacity-50"
            style={{ background: '#1B5E3F' }}
          >
            Guardar
          </button>
        </div>
        {guardado && (
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-accent">
            <IconCheck size={13} />
            Producción registrada ✓ ({parseInt(gastros) * 6} barquetas)
          </div>
        )}
      </div>
    </div>
  )
}