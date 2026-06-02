import { useState } from 'react'
import {
  IconPlus,
  IconClock,
  IconClipboardList,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'
import { useHistorial } from '../hooks/useHistorial'
import Spinner from '../components/ui/Spinner'

export default function Registrar() {
  const { user } = useAuth()
  const { registros, loading, error, addRegistro } = useHistorial(user?.id)

  const [plato, setPlato] = useState('')
  const [raciones, setRaciones] = useState('414')
  const [servicio, setServicio] = useState('Almuerzo')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isAlmuerzo = servicio === 'Almuerzo'
  const accentColor = isAlmuerzo ? '#1B5E3F' : '#1E3A5F'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    setSuccess(false)

    const racionesNum = parseInt(raciones, 10)

    if (!plato.trim()) {
      setSaveError('Escribí el nombre del plato')
      return
    }
    if (isNaN(racionesNum) || racionesNum < 1) {
      setSaveError('Las raciones deben ser al menos 1')
      return
    }

    setSaving(true)

    const result = await addRegistro({
      plato: plato.trim(),
      servicio,
      raciones: racionesNum,
    })

    setSaving(false)

    if (result.error) {
      setSaveError(result.error)
      return
    }

    // Success — clear form
    setPlato('')
    setRaciones('414')
    setServicio('Almuerzo')
    setSuccess(true)

    // Fade out success message after 3s
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <>
      {/* Card: Guardar producción */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconPlus size={17} className="text-accent" />
          Guardar producción del día
        </div>

        <form onSubmit={handleSubmit}>
          {/* Plato */}
          <div className="mb-3">
            <label className="block text-[11px] font-medium text-text2 mb-1">
              Plato elaborado
            </label>
            <input
              type="text"
              value={plato}
              onChange={(e) => setPlato(e.target.value)}
              placeholder="Ej: Muslo de pollo con arroz"
              className="w-full px-3 py-[10px] text-sm bg-bg border border-border rounded-lg text-text placeholder:text-text3 outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Raciones + Servicio */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-medium text-text2 mb-1">
                Raciones totales
              </label>
              <input
                type="number"
                value={raciones}
                onChange={(e) => setRaciones(e.target.value)}
                min="1"
                inputMode="numeric"
                className="w-full px-3 py-[10px] text-sm bg-bg border border-border rounded-lg text-text placeholder:text-text3 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text2 mb-1">
                Servicio
              </label>
              <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="w-full px-3 py-[10px] text-sm bg-bg border border-border rounded-lg text-text outline-none focus:border-accent transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                }}
              >
                <option>Almuerzo</option>
                <option>Cena</option>
              </select>
            </div>
          </div>

          {/* Error message */}
          {saveError && (
            <div className="flex items-center gap-2 text-xs text-red bg-redLight px-3 py-2 rounded-lg mb-3">
              <IconAlertCircle size={14} />
              {saveError}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 text-xs text-white px-3 py-2 rounded-lg mb-3" style={{ background: accentColor }}>
              <IconCheck size={14} />
              Registro guardado correctamente
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-[10px] text-sm font-semibold text-white border-none rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: accentColor }}
          >
            {saving ? (
              <>
                <Spinner size="sm" />
                <span>Guardando…</span>
              </>
            ) : (
              <>
                <IconCheck size={16} />
                <span>Guardar en historial</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Card: Parte de hoy */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconClock size={17} className="text-accent" />
          Parte de hoy
        </div>

        {loading ? (
          <div className="flex justify-center py-7">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-7 text-text3 text-xs">
            <IconAlertCircle size={24} className="mb-2 opacity-50" />
            {error}
          </div>
        ) : registros.length === 0 ? (
          <div className="flex flex-col items-center py-7 text-text3 text-xs">
            <IconClipboardList size={24} className="mb-2 opacity-50" />
            Sin registros hoy aún
          </div>
        ) : (
          <div className="space-y-2">
            {registros.map((r) => (
              <div
                key={r.id}
                className="border border-border rounded-lg px-3 py-[10px]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text">
                    {r.plato}
                  </span>
                  <span className="text-[11px] font-mono text-text3">
                    {formatHora(r.created_at)} · {r.servicio}
                  </span>
                </div>
                <div className="text-[12px] text-text2">
                  {r.raciones} raciones
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function formatHora(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}
