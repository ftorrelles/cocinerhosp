import { useState, type FormEvent } from 'react'
import { IconLock, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'

export default function Perfil() {
  const { user, cambiarPin } = useAuth()

  const [pinActual, setPinActual] = useState('')
  const [pinNuevo, setPinNuevo] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!pinActual || pinActual.length !== 4 || !/^\d{4}$/.test(pinActual)) {
      setError('El PIN actual debe tener 4 dígitos')
      return
    }

    if (!pinNuevo || pinNuevo.length !== 4 || !/^\d{4}$/.test(pinNuevo)) {
      setError('El PIN nuevo debe tener exactamente 4 dígitos numéricos')
      return
    }

    if (pinNuevo !== pinConfirm) {
      setError('Los PIN nuevos no coinciden')
      return
    }

    if (pinActual === pinNuevo) {
      setError('El PIN nuevo debe ser diferente al actual')
      return
    }

    setLoading(true)
    const result = await cambiarPin(pinActual, pinNuevo)
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess(true)
    setPinActual('')
    setPinNuevo('')
    setPinConfirm('')
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <IconLock size={20} className="text-accent" />
        <h1 className="text-base font-semibold text-text">Cambiar PIN</h1>
      </div>

      <div className="bg-surface border border-border rounded-xl p-[14px] shadow-sm mb-4">
        <p className="text-xs text-text2 mb-1">Usuario</p>
        <p className="text-sm font-medium text-text">{user?.nombre_completo}</p>
        <p className="text-[11px] font-mono text-text3">@{user?.username}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pinActual" className="block text-xs text-text2 mb-1">
            PIN actual
          </label>
          <input
            id="pinActual"
            type="password"
            inputMode="numeric"
            maxLength={4}
            pattern="[0-9]{4}"
            autoComplete="current-password"
            placeholder="4 dígitos"
            value={pinActual}
            onChange={(e) => setPinActual(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3 focus:outline-none focus:border-accent transition-colors"
            disabled={loading}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="pinNuevo" className="block text-xs text-text2 mb-1">
            PIN nuevo
          </label>
          <input
            id="pinNuevo"
            type="password"
            inputMode="numeric"
            maxLength={4}
            pattern="[0-9]{4}"
            autoComplete="new-password"
            placeholder="4 dígitos"
            value={pinNuevo}
            onChange={(e) => setPinNuevo(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3 focus:outline-none focus:border-accent transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="pinConfirm" className="block text-xs text-text2 mb-1">
            Confirmar PIN nuevo
          </label>
          <input
            id="pinConfirm"
            type="password"
            inputMode="numeric"
            maxLength={4}
            pattern="[0-9]{4}"
            autoComplete="new-password"
            placeholder="4 dígitos"
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3 focus:outline-none focus:border-accent transition-colors"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red">
            <IconAlertCircle size={14} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-accent">
            <IconCheck size={14} />
            PIN actualizado correctamente
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !pinActual || pinNuevo.length !== 4 || pinConfirm.length !== 4}
          className="w-full h-12 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            'Cambiar PIN'
          )}
        </button>
      </form>
    </div>
  )
}
