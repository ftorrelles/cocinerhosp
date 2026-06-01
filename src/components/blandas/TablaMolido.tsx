import { IconBlender } from '@tabler/icons-react'
import {
  MOLIDO_INGREDIENTES,
  MOLIDO_PROTEINA,
  MOLIDO_BARQUETAS,
  MOLIDO_KG_BARQUETA,
  MOLIDO_TOTAL_KG,
} from '../../data/blandas'

export default function TablaMolido() {
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
            <span className="font-mono text-sm font-medium text-text2">
              {ing.cantidad}
            </span>
          </div>
        ))}
      </div>

      {/* Proteína variable */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[11px] font-semibold text-text2 mb-2">
          Proteína variable (según día)
        </p>
        <div className="grid grid-cols-2 gap-[7px]">
          {MOLIDO_PROTEINA.map((p) => (
            <div
              key={p.tipo}
              className="bg-accent-light rounded-sm px-[10px] py-[7px]"
            >
              <span className="text-[11px] text-text2 block">{p.tipo}</span>
              <span className="font-mono text-sm font-medium text-text">
                {p.kgBruto} kg bruto
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
