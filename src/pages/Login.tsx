import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBuildingHospital } from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { session, loading: authLoading, signIn } = useAuth()

  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/', { replace: true })
    }
  }, [session, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim()) {
      setError('Ingresá tu usuario')
      return
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('El PIN debe tener 4 dígitos')
      return
    }

    setLoading(true)
    const result = await signIn(username, pin)
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <IconBuildingHospital
            size={36}
            className="text-accent mx-auto mb-3"
          />
          <h1 className="text-[22px] font-semibold text-text">
            CocinerHosp
          </h1>
          <p className="text-sm text-text2 mt-1">Accedé a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[11px] text-text2 mb-1"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ej: carlos"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3 focus:outline-none focus:border-accent transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block text-[11px] text-text2 mb-1"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]{4}"
              autoComplete="one-time-code"
              placeholder="4 dígitos"
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPin(val)
              }}
              className="w-full px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text placeholder:text-text3 focus:outline-none focus:border-accent transition-colors"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-xs text-red text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || pin.length !== 4}
            className="w-full h-12 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ingresando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
