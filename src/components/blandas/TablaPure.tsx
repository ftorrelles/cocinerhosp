import { useState } from 'react'
import { IconCarrot, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { useHistorial } from '../../hooks/useHistorial'
import { PURE, PURE_BARQUETAS, PURE_KG_BARQUETA, PURE_TOTAL_KG } from '../../data/blandas'

export default function TablaPure() {
  const user = useAppStore((s) => s.user)
  const servicio = useAppStore((s) => s.servicio)
  const { addRegistro } = useHistorial(user?.id)
  const [barquetas, setBarquetas] = useState(String(PURE_BARQUETAS))
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = async () => {
    const b = parseInt(barquetas) || 0
    if (b < 1) return
    const r = await addRegistro({
      plato: 'Blandas - Puré',
      servicio: servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
      raciones: b,
      categoria: 'blandas',
    })
    if (!r.error) setGuardado(true)
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
        <IconCarrot size={17} className="text-accent" />
        <span>
          Puré de papas{' '}
          <span className="font-normal text-text2 text-xs">
            — {PURE_BARQUETAS} barquetas × {PURE_KG_BARQUETA} kg = {PURE_TOTAL_KG} kg/día
          </span>
        </span>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-text2 font-semibold leading-loose">
            <th className="text-left font-medium">Ingrediente</th>
            <th className="text-right font-medium">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-[6px] text-text">
              Papas congeladas <span className="text-text2">(2.5 kg/bolsa)</span>
            </td>
            <td className="py-[6px] text-right font-mono text-sm font-medium text-text">
              {PURE.bolsasPapa} bolsas ({PURE.kgBruto} kg)
            </td>
          </tr>
          <tr className="bg-surface2 rounded">
            <td className="py-[6px] text-text">Merma {PURE.mermaP}%</td>
            <td className="py-[6px] text-right font-mono text-sm font-medium text-warn">
              −{PURE.mermaKg} kg
            </td>
          </tr>
          <tr>
            <td className="py-[6px] text-text font-semibold">Papa cocida disponible</td>
            <td className="py-[6px] text-right font-mono text-sm font-bold text-accent">
              ~{PURE.papaCocidaKg} kg
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-[11px] text-text3 mt-2 italic">
        Sal + aceite al gusto (~300-400 ml aceite)
      </p>

      <div className="mt-3 pt-3 border-t border-border">
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
            Producción registrada ✓ ({barquetas} barquetas)
          </div>
        )}
      </div>
    </div>
  )
}