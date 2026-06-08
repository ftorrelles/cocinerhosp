import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ── Types ──

export interface TopPlato {
  plato: string
  raciones: number
}

export interface UltimoRegistro {
  id: string
  plato: string
  raciones: number
  servicio: string
  categoria: string
  fecha: string
  created_at: string
  chef: string | null
}

export interface DashboardData {
  total_raciones: number
  total_elaboraciones: number
  dias_con_registro: number
  media_diaria: number
  hechos_hoy: number
  top_platos: TopPlato[]
  ultimos_registros: UltimoRegistro[]
}

export interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refresh: () => void
}

// ── Helpers ──

function getCurrentMonth(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

// ── Hook ──

export function useDashboard(
  usuarioId: string | undefined,
  mes?: string,
  categoria?: string,
): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const month = mes ?? getCurrentMonth()

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: Record<string, unknown> = {
        p_usuario_id: usuarioId ?? null,
        p_mes: month,
      }
      if (categoria) params.p_categoria = categoria
      console.log('🔍 obtener_dashboard params:', params)

      const { data: raw, error: rpcError } = await supabase.rpc(
        'obtener_dashboard',
        params,
      )

      if (rpcError) {
        console.error('🔍 Error fetching dashboard:', rpcError)
        setError('Error al cargar el dashboard')
        return
      }

      console.log('🔍 obtener_dashboard result:', raw)

      setData(raw as unknown as DashboardData)
    } catch (err) {
      console.error('🔍 Error in fetchDashboard:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [usuarioId, month, categoria])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, loading, error, refresh: fetchDashboard }
}
