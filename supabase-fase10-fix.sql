-- ══════════════════════════════════════════════════════════
-- CocinerHosp — Fase 10: Fix RPC obtener_dashboard
-- Pegar TODO en el SQL Editor de Supabase Dashboard
-- ══════════════════════════════════════════════════════════
-- MOTIVO: CREATE OR REPLACE no actualizó correctamente la
-- firma de 2 parámetros a 3 parámetros. Hacemos DROP + CREATE.
-- ══════════════════════════════════════════════════════════

-- 1. Drop de la versión anterior (2 parámetros)
DROP FUNCTION IF EXISTS public.obtener_dashboard(UUID, TEXT);
DROP FUNCTION IF EXISTS public.obtener_dashboard(UUID, TEXT, TEXT);

-- 2. Crear la función con 3 parámetros (el tercero opcional)
CREATE FUNCTION public.obtener_dashboard(
  p_usuario_id UUID DEFAULT NULL,
  p_mes TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM'),
  p_categoria TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_raciones INTEGER;
  v_total_elaboraciones INTEGER;
  v_dias_con_registro INTEGER;
  v_media_diaria NUMERIC;
  v_hechos_hoy INTEGER;
  v_top_platos JSON;
  v_ultimos_registros JSON;
BEGIN
  -- Métricas del mes (con filtro opcional de categoría)
  SELECT
    COALESCE(SUM(r.raciones), 0),
    COUNT(*),
    COUNT(DISTINCT r.fecha)
  INTO v_total_raciones, v_total_elaboraciones, v_dias_con_registro
  FROM public.registros r
  WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
    AND to_char(r.fecha, 'YYYY-MM') = p_mes
    AND (p_categoria IS NULL OR r.categoria = p_categoria);

  -- Hechos hoy
  SELECT COUNT(*)
  INTO v_hechos_hoy
  FROM public.registros r
  WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
    AND r.fecha = CURRENT_DATE
    AND (p_categoria IS NULL OR r.categoria = p_categoria);

  -- Media raciones/día
  v_media_diaria := CASE
    WHEN v_dias_con_registro > 0
    THEN ROUND(v_total_raciones::NUMERIC / v_dias_con_registro)
    ELSE 0
  END;

  -- Top 6 platos
  SELECT JSON_AGG(sub ORDER BY sub.raciones DESC)
  INTO v_top_platos
  FROM (
    SELECT r.plato, SUM(r.raciones) AS raciones
    FROM public.registros r
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
      AND to_char(r.fecha, 'YYYY-MM') = p_mes
      AND (p_categoria IS NULL OR r.categoria = p_categoria)
    GROUP BY r.plato
    ORDER BY SUM(r.raciones) DESC
    LIMIT 6
  ) sub;

  -- Últimos 8 registros (con categoría)
  SELECT JSON_AGG(sub ORDER BY sub.created_at DESC)
  INTO v_ultimos_registros
  FROM (
    SELECT
      r.id, r.plato, r.raciones, r.servicio, r.categoria,
      r.fecha, r.created_at,
      u.nombre_completo AS chef
    FROM public.registros r
    LEFT JOIN public.usuarios u ON u.id = r.usuario_id
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
      AND (p_categoria IS NULL OR r.categoria = p_categoria)
    ORDER BY r.created_at DESC
    LIMIT 8
  ) sub;

  RETURN JSON_BUILD_OBJECT(
    'total_raciones', v_total_raciones,
    'total_elaboraciones', v_total_elaboraciones,
    'dias_con_registro', v_dias_con_registro,
    'media_diaria', v_media_diaria,
    'hechos_hoy', v_hechos_hoy,
    'top_platos', COALESCE(v_top_platos, '[]'::JSON),
    'ultimos_registros', COALESCE(v_ultimos_registros, '[]'::JSON)
  );
END;
$$;
