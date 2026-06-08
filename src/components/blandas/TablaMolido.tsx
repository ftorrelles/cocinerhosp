import { useState } from 'react'
import { IconBlender, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { useHistorial } from '../../hooks/useHistorial'
import {
  MOLIDO_INGREDIENTES,
  MOLIDO_PROTEINA,
  MOLIDO_BARQUETAS,
  MOLIDO_KG_BARQUETA,
  MOLIDO_TOTAL_KG,
} from '../../data/blandas'

export default function TablaMolido() {
  const user = useAppStore((s) => s.user)
  const servicio = useAppStore((s) => s.servicio)
  const { addRegistro } = useHistorial(user?.id)
  const [barquetas, setBarquetas] = useState(String(MOLIDO_BARQUETAS))
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = async () => {
    const b = parseInt(barquetas) || 0
    if (b < 1) return
    const r = await addRegistro({
      plato: 'Blandas - Molido',
      servicio: servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
      raciones: b * 10,
      categoria: 'blandas',
    })
    if (!r.error) setGuardado(true)
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
        <IconBlender size={17} className="text-accent" />
        <span>
          Molido{' '}
          <span className="font-normal text-text2 text-xs">
            — {MOLIDO_BARQUETAS} barquetas × {MOLIDO_KG_BARQUETA} kg = {MOLIDO_TOTAL_KG} kg/día
          </span>
        </span>
      </div>

      <div className="space-y-[5px] text-xs">
        {MOLIDO_INGREDIENTES.map((ing) => (
          <div key={ing.nombre} className="flex justify-between items-center">
            <span className="text-text">{ing.nombre}</span>
            <span className="font-mono text-sm font-medium text-text2">{ing.cantidad}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[11px] font-semibold text-text2 mb-2">Proteína variable (según día)</p>
        <div className="grid grid-cols-2 gap-[7px] mb-3">
          {MOLIDO_PROTEINA.map((p) => (
            <div key={p.tipo} className="bg-accent-light rounded-sm px-[10px] py-[7px]">
              <span className="text-[11px] text-text2 block">{p.tipo}</span>
              <span className="font-mono text-sm font-medium text-text">{p.kgBruto} kg bruto</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <label className="text-[11px] text-text2 block mb-[3px]">Barquetas producidas</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={barquetas}
            onChange={(e) => { setGuardado(false); setBarquetas(e.target.value) }}
            className="flex-1 px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
          />
          <button
            onClick={handleGuardar}
            disabled={!barquetas || parseInt(barquetas) < 1}
            className="px-3 py-[7px] text-xs font-semibold text-white border-none rounded-sm cursor-pointer disabled:opacity-50"
            style={{ background: '#1B5E3F' }}
          >
            Guardar
          </button>
        </div>
        {guardado && (
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-accent">
            <IconCheck size={13} />
            {barquetas} barquetas ({parseInt(barquetas) * 10} raciones) registradas ✓
          </div>
        )}
      </div>
    </div>
  )
}