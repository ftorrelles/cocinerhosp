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

  const signOut = async (): Promise<void> => {
    clearSession()
    setUser(null)
    useAppStore.getState().setUser(null)
  }

  return { user, session: user, loading, signIn, signOut }
}
