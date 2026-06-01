import { IconSoup } from '@tabler/icons-react'
import { CHINOS, CHINOS_BARQUETAS, CHINOS_KG_BARQUETA, CHINOS_TOTAL_KG } from '../../data/blandas'

export default function TablaChinos() {
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
            <tr
              key={c.tipo}
              className={i % 2 === 1 ? 'bg-surface2 rounded' : ''}
            >
              <td className="py-[6px] text-text font-medium">{c.tipo}</td>
              <td className="py-[6px] text-text2">{c.ingredientes}</td>
              <td className="py-[6px] text-center font-mono text-sm font-medium text-text">
                {c.bolsas}
              </td>
              <td className="py-[6px] text-right font-mono text-sm font-medium text-text">
                {c.brutoKg} kg
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
