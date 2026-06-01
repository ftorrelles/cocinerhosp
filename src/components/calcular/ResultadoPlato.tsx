import { IconToolsKitchen2, IconMeat, IconSnowflake } from '@tabler/icons-react'
import type { ResultadoPlato as ResultadoPlatoType } from '../../store/useAppStore'

interface ResultadoPlatoProps {
  resultado: ResultadoPlatoType
  color: string
}

function GuarBloque({
  titulo,
  nombre,
  bolsas,
  brutoNecesario,
  netoReal,
  sobrante,
  mermaP,
  totalPacientes,
  racionG,
  bolsaKg,
}: {
  titulo: string
  nombre: string
  bolsas: number
  brutoNecesario: number
  netoReal: number
  sobrante: number
  mermaP: number
  totalPacientes: number
  racionG: number
  bolsaKg: number
}) {
  const absorcion = mermaP < 0
  const mermaLabel = absorcion
    ? `Peso en seco (absorbe ×${Math.round(1 + Math.abs(mermaP) / 100)})`
    : `Merma ${mermaP}%`

  return (
    <div className="px-[14px] py-[10px] border-b border-border last:border-b-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-text3 mb-[7px] flex items-center gap-[5px]">
        <IconSnowflake size={12} />
        {`${titulo}: ${nombre}`}
      </div>

      <div className="flex justify-between items-baseline py-1 border-b border-surface2">
        <span className="text-xs text-text2">{`Bolsas a abrir (${bolsaKg}kg)`}</span>
        <span className="text-xl font-mono font-semibold text-accent">{bolsas}</span>
      </div>

      <div className="flex justify-between items-baseline py-1 border-b border-surface2">
        <span className="text-xs text-text2">{mermaLabel}</span>
        <span className="text-sm font-medium text-text">
          {(brutoNecesario / 1000).toFixed(2)} kg
        </span>
      </div>

      <div className="flex justify-between items-baseline py-1 border-b border-surface2">
        <span className="text-xs text-text2">{`Neto listo → ${racionG}g × ${totalPacientes} pac.`}</span>
        <span className="text-sm font-medium text-text">
          {(netoReal / 1000).toFixed(2)} kg
        </span>
      </div>

      <div className="flex justify-between items-baseline py-1">
        <span className="text-xs text-text2">Sobrante estimado</span>
        <span
          className={`text-xs font-medium ${
            sobrante > 0 ? 'text-warn' : 'text-accent'
          }`}
        >
          {sobrante > 0
            ? `+${sobrante}g → ${Math.floor(sobrante / racionG)} rac. extra`
            : '0g ✓'}
        </span>
      </div>
    </div>
  )
}

export default function ResultadoPlato({
  resultado,
  color,
}: ResultadoPlatoProps) {
  const r = resultado
  const totalPacientes = r.guar1.netoNecesario / r.guar1Gramos

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden mb-[10px] shadow-sm">
      <div
        className="flex items-center gap-2 px-[14px] py-[10px] text-white text-sm font-semibold"
        style={{ background: color }}
      >
        <IconToolsKitchen2 size={16} />
        {`${r.nombre} — ${r.servicio}`}
      </div>

      {/* Proteína */}
      <div className="px-[14px] py-[10px] border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text3 mb-[7px] flex items-center gap-[5px]">
          <IconMeat size={12} />
          Proteína
        </div>

        <div className="flex justify-between items-baseline py-1 border-b border-surface2">
          <span className="text-xs text-text2">Cajas a abrir</span>
          <span className="text-xl font-mono font-semibold text-accent">
            {r.proteina.cajasAbrir}
          </span>
        </div>

        <div className="flex justify-between items-baseline py-1 border-b border-surface2">
          <span className="text-xs text-text2">{`${r.nombreUnidad} en esas cajas`}</span>
          <span className="text-sm font-medium text-text">
            {r.proteina.unidadesDisponibles}
          </span>
        </div>

        <div className="flex justify-between items-baseline py-1 border-b border-surface2">
          <span className="text-xs text-text2">{`Necesarias (${r.unidadesPorRacion} × ${totalPacientes} pac.)`}</span>
          <span className="text-sm font-medium text-text">
            {r.proteina.unidadesNecesarias}
          </span>
        </div>

        {r.mermaProtP > 0 && (
          <div className="flex justify-between items-baseline py-1 border-b border-surface2">
            <span className="text-xs text-text2">{`Merma estimada (${r.mermaProtP}%)`}</span>
            <span className="text-xs text-warn">{`−${Math.round(
              r.proteina.unidadesNecesarias * r.mermaProtP / 100
            )} uds.`}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline py-1">
          <span className="text-xs text-text2">Sobrante</span>
          <span
            className={`text-xs font-medium ${
              r.proteina.sobrante === 0 ? 'text-accent' : 'text-warn'
            }`}
          >
            {r.proteina.sobrante === 0
              ? `${r.proteina.sobrante} ✓`
              : `${r.proteina.sobrante} ${r.nombreUnidad} → ${r.proteina.sobranteRaciones} rac. extra`}
          </span>
        </div>

        <div className="mt-[6px]">
          <div className="text-[10px] text-text3 italic mb-1">
            Desglose por centro:
          </div>
          <div className="flex flex-wrap gap-1">
            {r.desglose.map((c) => (
              <span
                key={c.nombre}
                className="px-[8px] py-[3px] rounded-[10px] text-[10px] font-mono font-medium"
                style={{
                  background: `${c.color}22`,
                  color: c.color,
                }}
              >
                {`${c.nombre}: ${c.unidades} ${r.nombreUnidad}`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Guarnición 1 */}
      <GuarBloque
        titulo="Guarnición 1"
        nombre={r.guar1Nombre}
        bolsas={r.guar1.bolsas}
        brutoNecesario={r.guar1.brutoNecesario}
        netoReal={r.guar1.netoReal}
        sobrante={r.guar1.sobrante}
        mermaP={r.guar1.mermaP}
        totalPacientes={totalPacientes}
        racionG={r.guar1Gramos}
        bolsaKg={r.guar1.brutoNecesario / (r.guar1.bolsas * 1000) * 1000 / 1000 || 2.5}
      />

      {/* Guarnición 2 */}
      {r.guar2 && r.guar2Nombre && (
        <GuarBloque
          titulo="Guarnición 2"
          nombre={r.guar2Nombre}
          bolsas={r.guar2.bolsas}
          brutoNecesario={r.guar2.brutoNecesario}
          netoReal={r.guar2.netoReal}
          sobrante={r.guar2.sobrante}
          mermaP={r.guar2.mermaP}
          totalPacientes={totalPacientes}
          racionG={r.guar2Gramos ?? 60}
          bolsaKg={2.5}
        />
      )}
    </div>
  )
}
