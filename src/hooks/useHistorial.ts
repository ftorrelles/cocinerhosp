import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ── Types ──

export interface Registro {
  id: string
  usuario_id: string
  plato: string
  servicio: string
  raciones: number
  fecha: string
  notas: string | null
  created_at: string
}

export interface UseHistorialReturn {
  registros: Registro[]
  loading: boolean
  error: string | null
  addRegistro: (params: {
    plato: string
    servicio: string
    raciones: number
    notas?: string
  }) => Promise<{ error?: string }>
}

// ── Hook ──

export function useHistorial(usuarioId: string | undefined): UseHistorialReturn {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRegistrosHoy = useCallback(async () => {
    if (!usuarioId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: rpcError } = await supabase.rpc('obtener_registros_hoy', {
        p_usuario_id: usuarioId,
      })

      if (rpcError) {
        console.error('🔍 Error fetching today\'s registros:', rpcError)
        setError('Error al cargar el historial')
        return
      }

      setRegistros((data as Registro[]) ?? [])
    } catch (err) {
      console.error('🔍 Error in fetchRegistrosHoy:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [usuarioId])

  // Fetch on mount
  useEffect(() => {
    fetchRegistrosHoy()
  }, [fetchRegistrosHoy])

  const addRegistro = useCallback(
    async (params: {
      plato: string
      servicio: string
      raciones: number
      notas?: string
    }): Promise<{ error?: string }> => {
      if (!usuarioId) {
        return { error: 'Usuario no autenticado' }
      }

      const { plato, servicio, raciones, notas } = params

      if (!plato.trim()) {
        return { error: 'Escribí el nombre del plato' }
      }
      if (raciones < 1) {
        return { error: 'Las raciones deben ser al menos 1' }
      }

      try {
        const { error: rpcError } = await supabase.rpc('insertar_registro', {
          p_usuario_id: usuarioId,
          p_plato: plato.trim(),
          p_servicio: servicio,
          p_raciones: raciones,
          p_notas: notas ?? null,
        })

        if (rpcError) {
          console.error('🔍 Error inserting registro:', rpcError)
          return { error: 'Error al guardar el registro' }
        }

        // Refresh the list after successful insert
        await fetchRegistrosHoy()

        return {}
      } catch (err) {
        console.error('🔍 Error in addRegistro:', err)
        return { error: 'Error de conexión' }
      }
    },
    [usuarioId, fetchRegistrosHoy],
  )

  return { registros, loading, error, addRegistro }
}
