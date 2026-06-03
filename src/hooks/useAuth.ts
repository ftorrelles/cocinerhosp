import { useEffect, useState } from 'react'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'

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
  cambiarPin: (pinActual: string, pinNuevo: string) => Promise<{ error?: string }>
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
  const [user, setUser] = useState<UserProfile | null>(() => {
    const loaded = loadSession()
    // Sync to Zustand for other components (TopBar, etc.)
    if (loaded) {
      useAppStore.getState().setUser(loaded)
    }
    return loaded
  })
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
      const { data, error } = await supabase.rpc('verificar_usuario', {
        p_username: username.trim().toLowerCase(),
      })

      if (error) {
        console.error('🔍 Supabase RPC error:', error)
        if (error.message?.includes('function "verificar_usuario" does not exist')) {
          return { error: 'Error de configuración: ejecutá el SQL de setup en Supabase.' }
        }
        return { error: 'Error de conexión. Verificá tu conexión a internet.' }
      }

      if (!data || data.length === 0) {
        console.warn('🔍 No user found for:', username.trim().toLowerCase())
        return { error: 'Usuario o PIN incorrecto' }
      }

      const userRow = data[0]

      const pinMatch = bcrypt.compareSync(pin, userRow.pin_hash)
      if (!pinMatch) {
        return { error: 'Usuario o PIN incorrecto' }
      }

      const profile: UserProfile = {
        id: userRow.id,
        username: userRow.username,
        nombre_completo: userRow.nombre_completo,
        rol: userRow.rol,
      }

      saveSession(profile)
      setUser(profile)
      useAppStore.getState().setUser(profile)

      return {}
    } catch (err) {
      console.error('🔍 Login catch block:', err)
      return { error: 'Error de conexión. Verificá tu conexión a internet.' }
    }
  }

  const cambiarPin = async (
    pinActual: string,
    pinNuevo: string,
  ): Promise<{ error?: string }> => {
    if (!pinActual || pinActual.length !== 4 || !/^\d{4}$/.test(pinActual)) {
      return { error: 'El PIN actual debe tener 4 dígitos' }
    }

    if (!pinNuevo || pinNuevo.length !== 4 || !/^\d{4}$/.test(pinNuevo)) {
      return { error: 'El PIN nuevo debe tener exactamente 4 dígitos numéricos' }
    }

    const currentUser = user ?? useAppStore.getState().user
    if (!currentUser) {
      return { error: 'No hay sesión activa' }
    }

    try {
      const { data, error } = await supabase.rpc('verificar_usuario', {
        p_username: currentUser.username,
      })

      if (error || !data || data.length === 0) {
        return { error: 'Error al verificar el PIN actual' }
      }

      const pinMatch = bcrypt.compareSync(pinActual, data[0].pin_hash)
      if (!pinMatch) {
        return { error: 'El PIN actual no es correcto' }
      }

      const nuevoHash = bcrypt.hashSync(pinNuevo, 10)
      const { error: updateError } = await supabase.rpc('cambiar_pin', {
        p_usuario_id: currentUser.id,
        p_pin_nuevo: nuevoHash,
      })

      if (updateError) {
        console.error('Error al cambiar PIN:', updateError)
        return { error: 'Error al cambiar el PIN. Intentalo de nuevo.' }
      }

      return {}
    } catch (err) {
      console.error('Error en cambiarPin:', err)
      return { error: 'Error de conexión. Verificá tu conexión a internet.' }
    }
  }

  const signOut = async (): Promise<void> => {
    clearSession()
    setUser(null)
    useAppStore.getState().setUser(null)
  }

  return { user, session: user, loading, signIn, signOut, cambiarPin }
}
