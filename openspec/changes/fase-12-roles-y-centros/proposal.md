# Proposal — Renombrar roles y centro

## Intent
Renombrar roles de usuario para mayor claridad (chef_jefe → chef_ejecutivo, chef → cocinero) y renombrar el centro "Centro" a "SJDD".

## Changes

### Rol renaming
- `chef_jefe` → `chef_ejecutivo` (permissions unchanged)
- `chef` → `cocinero` (permissions unchanged)
- `admin` stays as `admin`

### Centro renaming
- id `centro`: `nombre` "Centro" → "SJDD"

## Files to modify
- `src/data/centros.ts` — "Centro" → "SJDD"
- `src/pages/Dashboard.tsx` — `'chef_jefe'` → `'chef_ejecutivo'`
- `src/pages/Recetas.tsx` — `'chef_jefe'` → `'chef_ejecutivo'`
- `src/pages/Usuarios.tsx` — role options + defaults
- `supabase-fase12.sql` — UPDATE queries + drop/recreate RPCs

## SQL needed
- UPDATE roles in usuarios table
- UPDATE centro nombre in centros table
- Recreate RPCs (crear_receta, editar_receta, eliminar_receta) with new role values
- CREATE OR REPLACE crear_usuario RPC with new role values if it exists in Supabase
