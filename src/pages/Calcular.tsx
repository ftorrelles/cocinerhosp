import { useEffect, useRef } from 'react'
import { IconClock, IconToolsKitchen2, IconCalculator, IconPlus, IconAlertCircle } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import ServicioToggle from '../components/calcular/ServicioToggle'
import CentrosGrid from '../components/calcular/CentrosGrid'
import PlatoItem from '../components/calcular/PlatoItem'
import ResultadoPlato from '../components/calcular/ResultadoPlato'

export default function Calcular() {
  const servicio = useAppStore((s) => s.servicio)
  const pacientes = useAppStore((s) => s.pacientes)
  const platos = useAppStore((s) => s.platos)
  const resultados = useAppStore((s) => s.resultados)
  const addPlato = useAppStore((s) => s.addPlato)
  const calcular = useAppStore((s) => s.calcular)
  const resetResultados = useAppStore((s) => s.resetResultados)

  const resultadoRef = useRef<HTMLDivElement>(null)

  const total = Object.values(pacientes).reduce((a, b) => a + b, 0)
  const isAlmuerzo = servicio === 'almuerzo'
  const accentColor = isAlmuerzo ? '#1B5E3F' : '#1E3A5F'
  const accentLight = isAlmuerzo ? '#E8F3ED' : '#EFF6FF'
  const servicioLabel = isAlmuerzo ? 'Almuerzo' : 'Cena'

  // Reset results when servicio changes
  useEffect(() => {
    resetResultados()
  }, [servicio, resetResultados])

  const handleCalcular = () => {
    if (platos.length === 0) {
      alert('Añadí al menos un plato')
      return
    }
    if (total === 0) {
      alert('Introducí el número de pacientes')
      return
    }

    calcular()

    // Scroll to results after a brief delay for render
    setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      {/* Card: Servicio */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconClock size={17} className="text-accent" />
          Servicio
        </div>

        <ServicioToggle />

        <div className="mt-3">
          <CentrosGrid />
        </div>
      </div>

      {/* Card: Platos */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconToolsKitchen2 size={17} className="text-accent" />
          Platos del servicio
        </div>

        <div id="lista-platos">
          {platos.map((plato) => (
            <PlatoItem key={plato.id} platoId={plato.id} />
          ))}
        </div>

        <button
          onClick={() => addPlato()}
          className="w-full py-[9px] text-xs bg-transparent border border-dashed border-border rounded-sm text-text2 cursor-pointer mt-1 hover:bg-accent-light hover:text-accent hover:border-accent transition-colors"
        >
          <IconPlus size={13} style={{ verticalAlign: -1 }} /> Añadir otro plato
        </button>
      </div>

      {/* Card: Calcular */}
      <div
        className="border rounded-xl p-[14px] mb-[10px] shadow-sm"
        style={{ background: accentLight, borderColor: accentColor }}
      >
        <button
          onClick={handleCalcular}
          className="w-full py-3 text-sm font-semibold text-white border-none rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: accentColor }}
        >
          <IconCalculator size={16} />
          <span>{`Calcular ${servicioLabel} — ${total} pac.`}</span>
        </button>

        <div ref={resultadoRef} className="mt-3">
          {resultados === null ? null : resultados.length === 0 ? (
            <div className="flex flex-col items-center py-7 text-text3 text-xs">
              <IconAlertCircle size={24} className="mb-2 opacity-50" />
              {platos.length === 0
                ? 'Añadí al menos un plato para calcular'
                : 'No hay pacientes para calcular'}
            </div>
          ) : (
            resultados.map((r) => (
              <ResultadoPlato
                key={r.id}
                resultado={r}
                color={accentColor}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
