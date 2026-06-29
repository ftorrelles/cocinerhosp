import { useState } from 'react'
import { IconSoup, IconCalculator, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { useHistorial } from '../../hooks/useHistorial'
import { CHINOS_RECETAS, CHINOS_BARQUETAS, CHINOS_KG_BARQUETA, CHINOS_TOTAL_KG, escalarReceta, type ResultadoBlando } from '../../data/blandas'

const CHINO_OPTIONS = CHINOS_RECETAS.map((r) => ({ id: r.id, nombre: r.nombre, subtipo: r.subtipo }))

export default function TablaChinos() {
  const user = useAppStore((s) => s.user)
  const servicio = useAppStore((s) => s.servicio)
  const { addRegistro } = useHistorial(user?.id)

  const [selectedId, setSelectedId] = useState(CHINO_OPTIONS[0]?.id ?? '')
  const [barquetas, setBarquetas] = useState('')
  const [resultado, setResultado] = useState<ResultadoBlando | null>(null)
  const [guardado, setGuardado] = useState(false)

  const receta = CHINOS_RECETAS.find((r) => r.id === selectedId)

  const handleCalcular = () => {
    const b = parseInt(barquetas) || 0
    if (b < 1 || !receta) return
    setResultado(escalarReceta(receta, b))
    setGuardado(false)
  }

  const handleRegistrar = async () => {
    const b = parseInt(barquetas) || 0
    if (b < 1) return
    const r = await addRegistro({
      plato: `Blandas - Chinos ${receta?.subtipo ?? ''}`,
      servicio: servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
      raciones: b * 10,
      categoria: 'blandas',
    })
    if (!r.error) {
      setGuardado(true)
    }
  }

  const fmtIngrediente = (cant: number, unidad: string, nota?: string) => {
    const u = unidad === 'g' && cant >= 1000 ? `${cant / 1000} kg` : `${cant} ${unidad}`
    return nota ? `${u} (${nota})` : u
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
        <IconSoup size={17} className="text-accent" />
        <span>
          Chinos{' '}
          <span className="font-normal text-text2 text-xs">
            — referencia {CHINOS_BARQUETAS} barquetas × {CHINOS_KG_BARQUETA} kg = {CHINOS_TOTAL_KG} kg/día
          </span>
        </span>
      </div>

      {/* Tipo selector */}
      <div className="flex flex-wrap gap-[5px] mb-3">
        {CHINO_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => { setSelectedId(opt.id); setResultado(null); setGuardado(false) }}
            className={`px-[10px] py-[4px] text-xs border rounded-[20px] cursor-pointer transition-all ${
              selectedId === opt.id
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-text2 border-border hover:bg-accent-light hover:text-accent'
            }`}
          >
            {opt.subtipo}
          </button>
        ))}
      </div>

      {/* Receta base */}
      {receta && (
        <div className="bg-surface2 rounded-sm p-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text3 mb-[6px]">
            Receta base ({receta.barquetasBase} barquetas = 1 gastro)
          </p>
          <div className="text-xs space-y-[2px]">
            {receta.ingredientes.map((ing) => (
              <div key={ing.nombre} className="flex justify-between">
                <span className="text-text">{ing.nombre}</span>
                <span className="font-mono text-text2">{fmtIngrediente(ing.cantidadBase, ing.unidad, ing.nota)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input barquetas + Calcular */}
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          min={1}
          placeholder="Barquetas necesarias"
          value={barquetas}
          onChange={(e) => { setBarquetas(e.target.value); setGuardado(false) }}
          className="flex-1 px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
        />
        <button
          onClick={handleCalcular}
          disabled={!barquetas || parseInt(barquetas) < 1}
          className="px-3 py-[7px] text-xs font-semibold text-white border-none rounded-sm cursor-pointer flex items-center gap-1 disabled:opacity-50"
          style={{ background: '#1B5E3F' }}
        >
          <IconCalculator size={14} />
          Calcular
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="bg-surface border border-border rounded-sm p-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text3 mb-[6px]">
            Resultado para {resultado.barquetas} barquetas
          </p>
          <div className="space-y-[2px] text-xs mb-2">
            {resultado.ingredientes.map((ing) => (
              <div key={ing.nombre} className="flex justify-between items-baseline">
                <span className="text-text">{ing.nombre}</span>
                <span className="font-mono text-sm font-semibold text-accent">
                  {fmtIngrediente(ing.cantidadBase, ing.unidad, ing.nota)}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-text3 space-y-[2px]">
            {resultado.observaciones.map((obs, i) => (
              <p key={i} className="italic">{obs}</p>
            ))}
          </div>
        </div>
      )}

      {/* Registrar */}
      {resultado && (
        guardado ? (
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-accent py-[7px]">
            <IconCheck size={14} />
            {resultado.barquetas} barquetas ({resultado.barquetas * 10} raciones) registradas ✓
          </div>
        ) : (
          <button
            onClick={handleRegistrar}
            className="w-full py-[7px] text-xs font-semibold border border-accent rounded-sm bg-accent-light text-accent cursor-pointer active:scale-[0.98] transition-transform"
          >
            Registrar producción
          </button>
        )
      )}
    </div>
  )
}
