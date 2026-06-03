import { useCallback, useEffect, useState } from 'react'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

export interface UsuarioAdmin {
  id: string
  username: string
  nombre_completo: string
  rol: string
  centro_id: string | null
  activo: boolean
  created_at: string
}

export interface CrearUsuarioInput {
  nombre: string
  username: string
  pin: string
  rol: string
  centro_id?: string
}

export interface UseUsuariosReturn {
  usuarios: UsuarioAdmin[]
  loading: boolean
  error: string | null
  crearUsuario: (data: CrearUsuarioInput) => Promise<{ error?: string }>
  toggleUsuario: (id: string) => Promise<{ error?: string }>
  cambiarPinAdmin: (usuarioId: string, pinNuevo: string) => Promise<{ error?: string }>
  refresh: () => void
}

export function useUsuarios(): UseUsuariosReturn {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: rpcError } = await supabase.rpc('listar_usuarios')

      if (rpcError) {
        console.error('Error listing usuarios:', rpcError)
        setError('Error al cargar usuarios')
        return
      }

      setUsuarios(data as unknown as UsuarioAdmin[])
    } catch (err) {
      console.error('Error in fetchUsuarios:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  const crearUsuario = async (data: CrearUsuarioInput): Promise<{ error?: string }> => {
    if (!data.nombre.trim()) return { error: 'El nombre es obligatorio' }
    if (!data.username.trim()) return { error: 'El username es obligatorio' }
    if (!data.pin || data.pin.length !== 4 || !/^\d{4}$/.test(data.pin)) {
      return { error: 'El PIN debe tener exactamente 4 dígitos numéricos' }
    }
    if (!data.rol) return { error: 'El rol es obligatorio' }

    try {
      const pinHash = bcrypt.hashSync(data.pin, 10)
      const { error: rpcError } = await supabase.rpc('crear_usuario', {
        p_nombre: data.nombre.trim(),
        p_username: data.username.trim().toLowerCase(),
        p_pin_hash: pinHash,
        p_rol: data.rol,
        p_centro_id: data.centro_id ?? null,
      })

      if (rpcError) {
        if (rpcError.message?.includes('duplicate key')) {
          return { error: 'El username ya está en uso' }
        }
        return { error: 'Error al crear el usuario' }
      }

      await fetchUsuarios()
      return {}
    } catch (err) {
      console.error('Error creating user:', err)
      return { error: 'Error de conexión' }
    }
  }

  const toggleUsuario = async (id: string): Promise<{ error?: string }> => {
    try {
      const { error: rpcError } = await supabase.rpc('toggle_usuario', {
        p_usuario_id: id,
      })

      if (rpcError) {
        return { error: 'Error al cambiar estado del usuario' }
      }

      await fetchUsuarios()
      return {}
    } catch (err) {
      console.error('Error toggling user:', err)
      return { error: 'Error de conexión' }
    }
  }

  const cambiarPinAdmin = async (
    usuarioId: string,
    pinNuevo: string,
  ): Promise<{ error?: string }> => {
    if (!pinNuevo || pinNuevo.length !== 4 || !/^\d{4}$/.test(pinNuevo)) {
      return { error: 'El PIN debe tener exactamente 4 dígitos numéricos' }
    }

    try {
      const pinHash = bcrypt.hashSync(pinNuevo, 10)
      const { error: rpcError } = await supabase.rpc('cambiar_pin_admin', {
        p_usuario_id: usuarioId,
        p_pin_nuevo: pinHash,
      })

      if (rpcError) {
        return { error: 'Error al cambiar el PIN' }
      }

      return {}
    } catch (err) {
      console.error('Error changing pin admin:', err)
      return { error: 'Error de conexión' }
    }
  }

  return { usuarios, loading, error, crearUsuario, toggleUsuario, cambiarPinAdmin, refresh: fetchUsuarios }
}
