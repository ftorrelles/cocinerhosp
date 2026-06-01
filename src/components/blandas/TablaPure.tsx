import { IconCarrot } from '@tabler/icons-react'
import { PURE, PURE_BARQUETAS, PURE_KG_BARQUETA, PURE_TOTAL_KG } from '../../data/blandas'

export default function TablaPure() {
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
              Papas congeladas{' '}
              <span className="text-text2">(2.5 kg/bolsa)</span>
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
            <td className="py-[6px] text-text font-semibold">
              Papa cocida disponible
            </td>
            <td className="py-[6px] text-right font-mono text-sm font-bold text-accent">
              ~{PURE.papaCocidaKg} kg
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-[11px] text-text3 mt-2 italic">
        Sal + aceite al gusto (~300-400 ml aceite)
      </p>
    </div>
  )
}
