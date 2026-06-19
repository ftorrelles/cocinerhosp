-- ══════════════════════════════════════════════════════════
-- CocinerHosp — Fase 12: Renombrar roles y centro
-- Pegar TODO en el SQL Editor de Supabase Dashboard
-- ══════════════════════════════════════════════════════════

-- 1. Migrar roles existentes
UPDATE public.usuarios SET rol = 'chef_ejecutivo' WHERE rol = 'chef_jefe';
UPDATE public.usuarios SET rol = 'cocinero' WHERE rol = 'chef';

-- 2. Renombrar centro
UPDATE public.centros SET nombre = 'SJDD' WHERE id = 'centro';

-- 3. Recrear RPCs de recetas con nuevos roles
-- Estas funciones verifican que solo admin/chef_ejecutivo puedan crear/editar/eliminar

CREATE OR REPLACE FUNCTION public.crear_receta(
  p_nombre TEXT,
  p_servicio TEXT DEFAULT NULL,
  p_raciones_base INTEGER DEFAULT 12,
  p_temperatura TEXT DEFAULT NULL,
  p_tiempo TEXT DEFAULT NULL,
  p_notas TEXT DEFAULT NULL,
  p_ingredientes JSON DEFAULT '[]'::json,
  p_usuario_rol TEXT DEFAULT 'cocinero'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_receta_id UUID;
  v_resultado JSON;
BEGIN
  IF p_usuario_rol NOT IN ('admin', 'chef_ejecutivo') THEN
    RAISE EXCEPTION 'No tenés permisos para crear recetas';
  END IF;

  INSERT INTO public.recetas (nombre, servicio, raciones_base, temperatura, tiempo, notas)
  VALUES (p_nombre, p_servicio, p_raciones_base, p_temperatura, p_tiempo, p_notas)
  RETURNING id INTO v_receta_id;

  INSERT INTO public.receta_ingredientes (receta_id, nombre, cantidad, unidad, orden)
  SELECT v_receta_id, x.nombre, x.cantidad, x.unidad, x.orden
  FROM json_to_recordset(p_ingredientes) AS x(nombre TEXT, cantidad NUMERIC, unidad TEXT, orden INT);

  SELECT row_to_json(r) INTO v_resultado
  FROM (SELECT * FROM public.obtener_receta(v_receta_id)) r;

  RETURN v_resultado;
END;
$$;

CREATE OR REPLACE FUNCTION public.editar_receta(
  p_receta_id UUID,
  p_nombre TEXT,
  p_servicio TEXT DEFAULT NULL,
  p_raciones_base INTEGER DEFAULT 12,
  p_temperatura TEXT DEFAULT NULL,
  p_tiempo TEXT DEFAULT NULL,
  p_notas TEXT DEFAULT NULL,
  p_ingredientes JSON DEFAULT '[]'::json,
  p_usuario_rol TEXT DEFAULT 'cocinero'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_resultado JSON;
BEGIN
  IF p_usuario_rol NOT IN ('admin', 'chef_ejecutivo') THEN
    RAISE EXCEPTION 'No tenés permisos para editar recetas';
  END IF;

  UPDATE public.recetas
  SET nombre = p_nombre,
      servicio = p_servicio,
      raciones_base = p_raciones_base,
      temperatura = p_temperatura,
      tiempo = p_tiempo,
      notas = p_notas,
      updated_at = now()
  WHERE id = p_receta_id;

  DELETE FROM public.receta_ingredientes WHERE receta_id = p_receta_id;

  INSERT INTO public.receta_ingredientes (receta_id, nombre, cantidad, unidad, orden)
  SELECT p_receta_id, x.nombre, x.cantidad, x.unidad, x.orden
  FROM json_to_recordset(p_ingredientes) AS x(nombre TEXT, cantidad NUMERIC, unidad TEXT, orden INT);

  SELECT row_to_json(r) INTO v_resultado
  FROM (SELECT * FROM public.obtener_receta(p_receta_id)) r;

  RETURN v_resultado;
END;
$$;

CREATE OR REPLACE FUNCTION public.eliminar_receta(
  p_receta_id UUID,
  p_usuario_rol TEXT DEFAULT 'cocinero'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_usuario_rol NOT IN ('admin', 'chef_ejecutivo') THEN
    RAISE EXCEPTION 'No tenés permisos para eliminar recetas';
  END IF;

  UPDATE public.recetas
  SET activo = false, updated_at = now()
  WHERE id = p_receta_id;

  RETURN FOUND;
END;
$$;
