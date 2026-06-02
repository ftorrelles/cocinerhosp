-- ══════════════════════════════════════════════════════════
-- CocinerHosp — RPC para Dashboard (Fase 5)
-- Pegar en SQL Editor de Supabase Dashboard
-- ══════════════════════════════════════════════════════════

-- obtener_dashboard: métricas del mes para un chef (o todos si p_usuario_id IS NULL)
-- Devuelve JSON con: total_raciones, total_elaboraciones, dias_con_registro,
-- media_diaria, top_platos (top 6), ultimos_registros (últimos 8)
CREATE OR REPLACE FUNCTION public.obtener_dashboard(
  p_usuario_id UUID DEFAULT NULL,
  p_mes TEXT DEFAULT to_char(CURRENT_DATE, 'YYYY-MM')
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
  v_top_platos JSON;
  v_ultimos_registros JSON;
BEGIN
  -- Métricas básicas del mes
  SELECT
    COALESCE(SUM(r.raciones), 0),
    COUNT(*),
    COUNT(DISTINCT r.fecha)
  INTO v_total_raciones, v_total_elaboraciones, v_dias_con_registro
  FROM public.registros r
  WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
    AND to_char(r.fecha, 'YYYY-MM') = p_mes;

  -- Media raciones/día
  v_media_diaria := CASE
    WHEN v_dias_con_registro > 0
    THEN ROUND(v_total_raciones::NUMERIC / v_dias_con_registro)
    ELSE 0
  END;

  -- Top 6 platos más elaborados (por raciones)
  SELECT JSON_AGG(sub ORDER BY sub.raciones DESC)
  INTO v_top_platos
  FROM (
    SELECT r.plato, SUM(r.raciones) AS raciones
    FROM public.registros r
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
      AND to_char(r.fecha, 'YYYY-MM') = p_mes
    GROUP BY r.plato
    ORDER BY SUM(r.raciones) DESC
    LIMIT 6
  ) sub;

  -- Últimos 8 registros
  SELECT JSON_AGG(sub ORDER BY sub.created_at DESC)
  INTO v_ultimos_registros
  FROM (
    SELECT
      r.id, r.plato, r.raciones, r.servicio,
      r.fecha, r.created_at,
      u.nombre_completo AS chef
    FROM public.registros r
    LEFT JOIN public.usuarios u ON u.id = r.usuario_id
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
    ORDER BY r.created_at DESC
    LIMIT 8
  ) sub;

  RETURN JSON_BUILD_OBJECT(
    'total_raciones', v_total_raciones,
    'total_elaboraciones', v_total_elaboraciones,
    'dias_con_registro', v_dias_con_registro,
    'media_diaria', v_media_diaria,
    'top_platos', COALESCE(v_top_platos, '[]'::JSON),
    'ultimos_registros', COALESCE(v_ultimos_registros, '[]'::JSON)
  );
END;
$$;

-- ── Uso ──
-- SELECT obtener_dashboard(NULL, '2026-06');         -- Todos los chefs, junio 2026
-- SELECT obtener_dashboard('chef-uuid', '2026-06');  -- Solo un chef
-- SELECT obtener_dashboard();                          -- Chef actual? No, necesita UUID
-- SELECT obtener_dashboard(p_usuario_id => 'chef-uuid'); -- Solo un chef, mes actual
