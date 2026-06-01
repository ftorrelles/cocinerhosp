import { useEffect, useState } from 'react'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

const SESSION_KEY = 'cocinerhosp_session'

export interface UserProfile {
  id: string
  username: string
  nombre_completo: string
  rol: string
}

export interface UseAuthReturn {
  user: UserProfile | null
  session: UserProfile | null
  loading: boolean
  signIn: (username: string, pin: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

function loadSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UserProfile
    if (parsed && parsed.id && parsed.username) return parsed
    return null
  } catch {
    return null
  }
}

function saveSession(profile: UserProfile): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(() => loadSession())
  const [loading, setLoading] = useState(false)

  // On mount, session already loaded via lazy initialiser
  useEffect(() => {
    setLoading(false)
  }, [])

  const signIn = async (
    username: string,
    pin: string,
  ): Promise<{ error?: string }> => {
    if (!username.trim()) {
      return { error: 'Ingresá tu usuario' }
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { error: 'El PIN debe tener 4 dígitos' }
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, username, nombre_completo, rol, pin_hash')
        .eq('username', username.trim().toLowerCase())
        .eq('activo', true)
        .single()

      if (error || !data) {
        // PGRST116 = no rows returned (usuario no encontrado o inactivo)
        return { error: 'Usuario o PIN incorrecto' }
      }

      const pinMatch = bcrypt.compareSync(pin, data.pin_hash)
      if (!pinMatch) {
        return { error: 'Usuario o PIN incorrecto' }
      }

      const profile: UserProfile = {
        id: data.id,
        username: data.username,
        nombre_completo: data.nombre_completo,
        rol: data.rol,
      }

      saveSession(profile)
      setUser(profile)

      return {}
    } catch {
      return { error: 'Error de conexión. Verificá tu conexión a internet.' }
    }
  }

  const signOut = async (): Promise<void> => {
    clearSession()
    setUser(null)
  }

  return { user, session: user, loading, signIn, signOut }
}
