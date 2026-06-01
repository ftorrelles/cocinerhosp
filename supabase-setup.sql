-- ══════════════════════════════════════════════════════════
-- CocinerHosp — Setup de tablas + RPC de autenticación
-- Pegar TODO en el SQL Editor de Supabase Dashboard
-- ══════════════════════════════════════════════════════════

-- 1. Crear tabla usuarios (si no existe)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  nombre_completo TEXT,
  rol TEXT DEFAULT 'chef',
  centro_id TEXT,
  activo BOOLEAN DEFAULT true,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 3. Crear función RPC (SECURITY DEFINER = bypass RLS)
--    Esta función es el ÚNICO punto de entrada a la tabla usuarios
--    desde el cliente. El anon key NO puede leer la tabla directamente.
CREATE OR REPLACE FUNCTION public.verificar_usuario(p_username TEXT)
RETURNS TABLE(
  id UUID,
  username TEXT,
  nombre_completo TEXT,
  rol TEXT,
  centro_id TEXT,
  pin_hash TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.username,
    u.nombre_completo,
    u.rol,
    u.centro_id,
    u.pin_hash
  FROM public.usuarios u
  WHERE u.username = p_username
    AND u.activo = true;
END;
$$;

-- 4. Crear tabla centros (para referencia futura)
CREATE TABLE IF NOT EXISTS public.centros (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  pax_almuerzo INTEGER NOT NULL,
  pax_cena INTEGER NOT NULL,
  color TEXT,
  activo BOOLEAN DEFAULT true
);

-- 5. Insertar centros iniciales (si no existen)
INSERT INTO public.centros (id, nombre, pax_almuerzo, pax_cena, color, activo)
VALUES
  ('sur', 'Sur', 120, 120, '#1B5E3F', true),
  ('candelaria', 'Candelaria', 120, 30, '#1E3A5F', true),
  ('parque', 'Parque', 50, 50, '#6B3FA0', true),
  ('centro', 'Centro', 100, 100, '#8B4513', true),
  ('hogara', 'Hogar A', 12, 12, '#991B1B', true),
  ('hogarb', 'Hogar B', 12, 12, '#B45309', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar usuarios de prueba (PIN: 1234 para todos)
--    Los hash fueron generados con bcryptjs
INSERT INTO public.usuarios (username, nombre_completo, rol, centro_id, activo, pin_hash)
VALUES
  ('carlos', 'Carlos García', 'chef', 'sur', true, '$2b$10$6bfRwZcSTjJN1nqCsW9c5e9GM0aMr.93ZBaAZMci1J1YmmB/NRype'),
  ('maria', 'María López', 'chef', 'candelaria', true, '$2b$10$6bfRwZcSTjJN1nqCsW9c5e9GM0aMr.93ZBaAZMci1J1YmmB/NRype'),
  ('jefe', 'Juan Pérez', 'supervisor', NULL, true, '$2b$10$6bfRwZcSTjJN1nqCsW9c5e9GM0aMr.93ZBaAZMci1J1YmmB/NRype')
ON CONFLICT (username) DO NOTHING;

-- ══════════════════════════════════════════════════════════
-- Verificación: correr esto para confirmar que funciona
-- ══════════════════════════════════════════════════════════
-- SELECT * FROM public.verificar_usuario('carlos');
--   → debe devolver 1 fila con id, username, nombre_completo, rol, centro_id, pin_hash
-- SELECT * FROM public.verificar_usuario('nobody');
--   → debe devolver 0 filas
