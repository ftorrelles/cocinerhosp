import { useEffect, useState } from 'react'
import { type Session, type User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (username: string, pin: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (!newSession) {
          setLoading(false)
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (
    username: string,
    pin: string
  ): Promise<{ error?: string }> => {
    if (!username.trim()) {
      return { error: 'Ingresá tu usuario' }
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { error: 'El PIN debe tener 4 dígitos' }
    }

    const email = `${username.trim().toLowerCase()}@cocinerhosp.internal`

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    })

    if (error) {
      if (error.message.includes('Failed to fetch')) {
        return { error: 'Error de conexión. Verificá tu conexión a internet.' }
      }
      return { error: 'Usuario o PIN incorrecto' }
    }

    return {}
  }

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  return { user, session, loading, signIn, signOut }
}
