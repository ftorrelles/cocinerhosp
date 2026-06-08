import { useState, useEffect, useCallback } from 'react'
import { IconMeat, IconCalculator, IconX, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { PROTEINA_PRESETS } from '../../data/proteinaPresets'
import { detectarMerma } from '../../data/mermas'
import { useHistorial } from '../../hooks/useHistorial'

interface ProteinaSectionProps {
  preparacionId: string
}

export default function ProteinaSection({ preparacionId }: ProteinaSectionProps) {
  const prep = useAppStore((s) => s.proteinas.find((p) => p.id === preparacionId))
  const updateProteina = useAppStore((s) => s.updateProteina)
  const removeProteina = useAppStore((s) => s.removeProteina)
  const calcularProteinaPrep = useAppStore((s) => s.calcularProteinaPrep)
  const resultado = useAppStore((s) => s.resultadosProteinas[preparacionId])
  const totalPacientes = useAppStore((s) =>
    Object.values(s.pacientes).reduce((a, b) => a + b, 0),
  )

  // Local state for inputs (fix: no overwrite while editing)
  const [nombre, setNombre] = useState(prep?.nombre ?? '')
  const [udsCaja, setUdsCaja] = useState(String(prep?.unidadesPorCaja ?? 52))
  const [udsRacion, setUdsRacion] = useState(String(prep?.unidadesPorRacion ?? 1))
  const [nomUnidad, setNomUnidad] = useState(prep?.nombreUnidad ?? 'piezas')
  const [merma, setMerma] = useState(String(prep?.merma ?? 25))

  const [showCustom, setShowCustom] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const user = useAppStore((s) => s.user)
  const servicio = useAppStore((s) => s.servicio)
  const { addRegistro } = useHistorial(user?.id)

  // Sync store values to local state only when prep changes (e.g., preset applied)
  useEffect(() => {
    if (prep) {
      setNombre(prep.nombre)
      setUdsCaja(String(prep.unidadesPorCaja))
      setUdsRacion(String(prep.unidadesPorRacion))
      setNomUnidad(prep.nombreUnidad)
      setMerma(String(prep.merma))
    }
  }, [prep?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const syncToStore = useCallback(() => {
    if (!prep) return
    updateProteina(prep.id, {
      nombre,
      unidadesPorCaja: parseFloat(udsCaja) || 0,
      unidadesPorRacion: parseFloat(udsRacion) || 1,
      nombreUnidad: nomUnidad,
      merma: parseFloat(merma) || 0,
    })
  }, [prep, nombre, udsCaja, udsRacion, nomUnidad, merma, updateProteina])

  const handleBlur = useCallback(() => {
    // Restore defaults if empty
    if (!udsCaja.trim()) setUdsCaja('52')
    if (!udsRacion.trim()) setUdsRacion('1')
    if (!merma.trim()) setMerma('0')
    syncToStore()
  }, [udsCaja, udsRacion, merma, syncToStore])

  if (!prep) return null

  const applyPreset = (preset: (typeof PROTEINA_PRESETS)[number]) => {
    setNombre(preset.nombre)
    setUdsCaja(String(preset.caja))
    setUdsRacion(String(preset.racion))
    setNomUnidad(preset.unidad)

    const m = detectarMerma(preset.nombre, 'prot')
    if (m.found) {
      setMerma(String(m.merma))
    }

    setShowCustom(false)

    // Sync to store immediately
    updateProteina(prep.id, {
      nombre: preset.nombre,
      unidadesPorCaja: preset.caja,
      unidadesPorRacion: preset.racion,
      nombreUnidad: preset.unidad,
      merma: m.found ? m.merma : prep.merma,
      mermaAuto: m.found,
      mermaSource: m.found ? m.source : '',
    })
  }

  const handleMermaChange = (val: string) => {
    setMerma(val)
  }

  const handleCalculate = () => {
    syncToStore()
    calcularProteinaPrep(prep.id)
  }

  const showResult = resultado && 'cajasAbrir' in resultado

  return (
    <div className="bg-surface2 border border-border rounded-sm mb-[10px] overflow-hidden">
      {/* Header with name */}
      {!showCustom && (
        <div className="bg-surface px-3 py-[10px] flex items-center gap-2 border-b border-border">
          <input
            type="text"
            placeholder="Nombre proteína"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => { syncToStore(); detectarMerma(nombre, 'prot') }}
            className="flex-1 text-sm font-semibold border-none bg-transparent text-text placeholder:text-text3 min-w-0 outline-none"
          />
          <button
            onClick={() => removeProteina(prep.id)}
            className="px-2 py-1 text-xs bg-transparent border border-border rounded-[6px] text-text3 cursor-pointer flex-shrink-0"
          >
            <IconX size={13} />
          </button>
        </div>
      )}

      <div className="p-3">
        {/* Preset chips */}
        <div className="sec-lbl mb-2">
          <IconMeat size={13} style={{ verticalAlign: -2 }} />
          {' Proteína — selección rápida'}
        </div>

        <div className="grid grid-cols-4 gap-[5px] mb-3">
          {PROTEINA_PRESETS.map((preset) => (
            <button
              key={preset.nombre}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center py-2 px-1 text-[11px] text-center leading-tight border border-border rounded-sm bg-surface text-text2 cursor-pointer transition-all hover:bg-accent-light hover:border-accent hover:text-accent"
            >
              <IconMeat size={16} className="mb-[3px] text-text3" />
              {preset.nombre}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(true)}
            className="flex flex-col items-center py-2 px-1 text-[11px] text-center leading-tight border border-dashed border-border rounded-sm bg-surface text-accent cursor-pointer transition-all hover:bg-accent-light"
          >
            ＋ Otro
          </button>
        </div>

        {/* Custom preparation form */}
        {showCustom && (
          <div className="bg-surface border border-border rounded-sm p-3 mb-3">
            <div className="text-[11px] font-semibold text-text mb-2">Preparación personalizada</div>
            <div className="mb-2">
              <label className="text-[11px] text-text2 block mb-[3px]">Nombre</label>
              <input
                type="text"
                placeholder="Ej: Lomo de cerdo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
              />
            </div>
            <div className="grid grid-cols-3 gap-[7px] mb-2">
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">Unid./caja</label>
                <input
                  type="number"
                  min={0}
                  value={udsCaja}
                  onChange={(e) => setUdsCaja(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
                />
              </div>
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">Unid./ración</label>
                <input
                  type="number"
                  min={1}
                  value={udsRacion}
                  onChange={(e) => setUdsRacion(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
                />
              </div>
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">Nombre unidad</label>
                <input
                  type="text"
                  value={nomUnidad}
                  onChange={(e) => setNomUnidad(e.target.value)}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-text2 block mb-[3px]">Merma %</label>
              <div className="relative">
                <input
                  type="number"
                  min={-300}
                  max={80}
                  value={merma}
                  onChange={(e) => handleMermaChange(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] pr-12 text-sm border border-border rounded-sm bg-bg text-text"
                  style={{ paddingRight: '48px' }}
                />
                <span className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[9px] font-semibold px-[5px] py-[2px] rounded-[6px] tracking-wide pointer-events-none"
                  style={{
                    background: '#FEF3C7',
                    color: '#B45309',
                  }}
                >
                  manual
                </span>
              </div>
              <div className="text-[10px] text-text3 mt-[2px] italic leading-tight">
                {prep.mermaSource}
              </div>
            </div>
          </div>
        )}

        {/* Input fields */}
        {!showCustom && (
          <>
            <div className="grid grid-cols-3 gap-[7px] mb-2">
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">Unid./caja</label>
                <input
                  type="number"
                  min={0}
                  value={udsCaja}
                  onChange={(e) => setUdsCaja(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
                />
              </div>
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">Unid./ración</label>
                <input
                  type="number"
                  min={1}
                  value={udsRacion}
                  onChange={(e) => setUdsRacion(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
                />
              </div>
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">Nombre unidad</label>
                <input
                  type="text"
                  value={nomUnidad}
                  onChange={(e) => setNomUnidad(e.target.value)}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
                />
              </div>
            </div>

            <div className="field">
              <label className="text-[11px] text-text2 block mb-[3px]">Merma %</label>
              <div className="relative">
                <input
                  type="number"
                  min={-300}
                  max={80}
                  value={merma}
                  onChange={(e) => handleMermaChange(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] pr-12 text-sm border border-border rounded-sm bg-surface text-text"
                  style={{ paddingRight: '48px' }}
                />
                <span
                  className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[9px] font-semibold px-[5px] py-[2px] rounded-[6px] tracking-wide pointer-events-none"
                  style={{
                    background: prep.mermaAuto ? '#E8F3ED' : '#FEF3C7',
                    color: prep.mermaAuto ? '#1B5E3F' : '#B45309',
                  }}
                >
                  {prep.mermaAuto ? 'auto' : 'manual'}
                </span>
              </div>
              <div className="text-[10px] text-text3 mt-[2px] italic leading-tight">
                {prep.mermaSource}
              </div>
            </div>
          </>
        )}

        {/* Calcular button */}
        <button
          onClick={handleCalculate}
          disabled={totalPacientes === 0}
          className="w-full py-[9px] text-xs font-semibold text-white border-none rounded-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          style={{ background: '#1B5E3F' }}
        >
          <IconCalculator size={14} />
          <span>Calcular</span>
        </button>

        {/* Resultado inline */}
        {showResult && (
          <div className="mt-3 bg-surface border border-border rounded-sm p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text3 mb-[7px] flex items-center gap-[5px]">
              <IconMeat size={12} />
              Resultado
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">Cajas a abrir</span>
              <span className="text-lg font-mono font-semibold text-accent">
                {resultado.cajasAbrir}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">{`${prep.nombreUnidad} disponibles`}</span>
              <span className="text-sm font-medium text-text">
                {resultado.unidadesDisponibles}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">{`Necesarias (${prep.unidadesPorRacion} × ${totalPacientes} pac.)`}</span>
              <span className="text-sm font-medium text-text">
                {resultado.unidadesNecesarias}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1">
              <span className="text-xs text-text2">Sobrante</span>
              <span className={`text-xs font-medium ${resultado.sobrante === 0 ? 'text-accent' : 'text-warn'}`}>
                {resultado.sobrante === 0
                  ? `${resultado.sobrante} ✓`
                  : `${resultado.sobrante} ${prep.nombreUnidad} → ${resultado.sobranteRaciones} rac. extra`}
              </span>
            </div>

            {guardado ? (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-accent py-[7px]">
                <IconCheck size={14} />
                Preparación guardada ✓
              </div>
            ) : (
              <button
                onClick={async () => {
                  const r = await addRegistro({
                    plato: nombre || prep.nombre,
                    servicio: servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
                    raciones: totalPacientes,
                  })
                  if (!r.error) setGuardado(true)
                }}
                className="w-full mt-2 py-[7px] text-xs font-semibold border border-accent rounded-sm bg-accent-light text-accent cursor-pointer active:scale-[0.98] transition-transform"
              >
                Guardar como preparación
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
