import { useState, useEffect, useCallback } from 'react'
import { IconSnowflake, IconCalculator, IconX } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { GUARNICION_PRESETS } from '../../data/guarnicionPresets'
import { detectarMerma } from '../../data/mermas'

interface GuarnicionSectionProps {
  preparacionId: string
}

export default function GuarnicionSection({ preparacionId }: GuarnicionSectionProps) {
  const prep = useAppStore((s) => s.guarniciones.find((g) => g.id === preparacionId))
  const updateGuarnicion = useAppStore((s) => s.updateGuarnicion)
  const removeGuarnicion = useAppStore((s) => s.removeGuarnicion)
  const calcularGuarnicionPrep = useAppStore((s) => s.calcularGuarnicionPrep)
  const resultado = useAppStore((s) => s.resultadosGuarniciones[preparacionId])
  const totalPacientes = useAppStore((s) =>
    Object.values(s.pacientes).reduce((a, b) => a + b, 0),
  )

  // Local state for inputs (fix: no overwrite while editing)
  const [nombre, setNombre] = useState(prep?.nombre ?? '')
  const [bolsaKg, setBolsaKg] = useState(String(prep?.bolsaKg ?? 2.5))
  const [merma, setMerma] = useState(String(prep?.merma ?? 20))
  const [gramos, setGramos] = useState(String(prep?.gramos ?? 120))

  const [showCustom, setShowCustom] = useState(false)

  // Sync store values to local state only when prep changes (e.g., preset applied)
  useEffect(() => {
    if (prep) {
      setNombre(prep.nombre)
      setBolsaKg(String(prep.bolsaKg))
      setMerma(String(prep.merma))
      setGramos(String(prep.gramos))
    }
  }, [prep?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const syncToStore = useCallback(() => {
    if (!prep) return
    updateGuarnicion(prep.id, {
      nombre,
      bolsaKg: parseFloat(bolsaKg) || 2.5,
      merma: parseFloat(merma) || 0,
      gramos: parseFloat(gramos) || 120,
    })
  }, [prep, nombre, bolsaKg, merma, gramos, updateGuarnicion])

  const handleBlur = useCallback(() => {
    // Restore defaults if empty
    if (!bolsaKg.trim()) setBolsaKg('2.5')
    if (!merma.trim()) setMerma('0')
    if (!gramos.trim()) setGramos('120')
    syncToStore()
  }, [bolsaKg, merma, gramos, syncToStore])

  if (!prep) return null

  const applyPreset = (presetName: string) => {
    setNombre(presetName)

    const m = detectarMerma(presetName, 'guar')
    if (m.found) {
      setMerma(String(m.merma))
    }

    setShowCustom(false)

    // Sync to store immediately
    updateGuarnicion(prep.id, {
      nombre: presetName,
      bolsaKg: 2.5,
      merma: m.found ? m.merma : prep.merma,
      gramos: 120,
      mermaAuto: m.found,
      mermaSource: m.found ? m.source : '',
    })
  }

  const handleCalculate = () => {
    syncToStore()
    calcularGuarnicionPrep(prep.id)
  }

  const showResult = resultado && 'bolsas' in resultado

    // Helper to format grams nicely
  const fmtG = (g: number) =>
    g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g} g`

  return (
    <div className="bg-surface2 border border-border rounded-sm mb-[10px] overflow-hidden">
      {/* Header with name */}
      {!showCustom && (
        <div className="bg-surface px-3 py-[10px] flex items-center gap-2 border-b border-border">
          <input
            type="text"
            placeholder="Nombre guarnición"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => { syncToStore(); detectarMerma(nombre, 'guar') }}
            className="flex-1 text-sm font-semibold border-none bg-transparent text-text placeholder:text-text3 min-w-0 outline-none"
          />
          <button
            onClick={() => removeGuarnicion(prep.id)}
            className="px-2 py-1 text-xs bg-transparent border border-border rounded-[6px] text-text3 cursor-pointer flex-shrink-0"
          >
            <IconX size={13} />
          </button>
        </div>
      )}

      <div className="p-3">
        {/* Preset chips */}
        <div className="sec-lbl mb-2">
          <IconSnowflake size={13} style={{ verticalAlign: -2 }} />
          {' Guarnición — selección rápida'}
        </div>

        <div className="flex flex-wrap gap-[5px] mb-3">
          {GUARNICION_PRESETS.map((g) => (
            <button
              key={g}
              onClick={() => applyPreset(g)}
              className="px-[10px] py-[4px] text-xs border border-border rounded-[20px] cursor-pointer bg-surface text-text2 transition-all hover:bg-accent-light hover:text-accent hover:border-accent"
              style={
                nombre === g
                  ? { background: '#1B5E3F', color: '#fff', borderColor: '#1B5E3F' }
                  : {}
              }
            >
              {g}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(true)}
            className="px-[10px] py-[4px] text-xs border border-dashed border-border rounded-[20px] bg-surface text-accent cursor-pointer transition-all hover:bg-accent-light"
          >
            ＋ Otro
          </button>
        </div>

        {/* Custom preparation form */}
        {showCustom && (
          <div className="bg-surface border border-border rounded-sm p-3 mb-3">
            <div className="text-[11px] font-semibold text-text mb-2">Guarnición personalizada</div>
            <div className="mb-2">
              <label className="text-[11px] text-text2 block mb-[3px]">Nombre</label>
              <input
                type="text"
                placeholder="Ej: Espinacas salteadas"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
              />
            </div>
            <div className="grid grid-cols-3 gap-[7px] mb-2">
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">Bolsa (kg)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.5}
                  value={bolsaKg}
                  onChange={(e) => setBolsaKg(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
                />
              </div>
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">Merma %</label>
                <div className="relative">
                  <input
                    type="number"
                    min={-300}
                    max={80}
                    value={merma}
                    onChange={(e) => setMerma(e.target.value)}
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
              <div>
                <label className="text-[11px] text-text2 block mb-[3px]">g netos/rac.</label>
                <input
                  type="number"
                  min={1}
                  value={gramos}
                  onChange={(e) => setGramos(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-bg text-text"
                />
              </div>
            </div>
          </div>
        )}

        {/* Input fields */}
        {!showCustom && (
          <>
            <div className="grid grid-cols-3 gap-[7px] mb-2">
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">Bolsa (kg)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.5}
                  value={bolsaKg}
                  onChange={(e) => setBolsaKg(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
                />
              </div>
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">Merma %</label>
                <div className="relative">
                  <input
                    type="number"
                    min={-300}
                    max={80}
                    value={merma}
                    onChange={(e) => setMerma(e.target.value)}
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
              <div className="field">
                <label className="text-[11px] text-text2 block mb-[3px]">g netos/rac.</label>
                <input
                  type="number"
                  min={1}
                  value={gramos}
                  onChange={(e) => setGramos(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full px-[10px] py-[7px] text-sm border border-border rounded-sm bg-surface text-text"
                />
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
              <IconSnowflake size={12} />
              Resultado
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">Bolsas a abrir</span>
              <span className="text-lg font-mono font-semibold text-accent">
                {resultado.bolsas}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">Peso bruto necesario</span>
              <span className="text-sm font-medium text-text">
                {fmtG(resultado.brutoNecesario)}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-surface2">
              <span className="text-xs text-text2">Peso neto cocido</span>
              <span className="text-sm font-medium text-text">
                {fmtG(resultado.netoNecesario)}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1">
              <span className="text-xs text-text2">Sobrante</span>
              <span className="text-xs font-medium text-accent">
                {resultado.netoReal - resultado.netoNecesario > 0
                  ? fmtG(resultado.netoReal - resultado.netoNecesario)
                  : '0 g ✓'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
