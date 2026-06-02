# Proposal: fase-3-dietas-blandas

## Intent

Crear la pantalla de consulta de dietas blandas — una página puramente informativa donde los chefs ven las cantidades fijas diarias de producción de chinos, molido y puré, más el resumen de 48 bolsas congeladas totales.

## Scope

**In scope:**
1. Static data file: `src/data/blandas.ts` — arrays de chinos, molido, puré
2. `TablaChinos.tsx` — 3 tipos de chino en tabla
3. `TablaMolido.tsx` — ingredientes y proteína variable
4. `TablaPure.tsx` — 32 bolsas de papas con merma
5. `Blandas.tsx` — página que ensambla las 3 tablas + header + resumen
6. Update `App.tsx` — reemplazar placeholder con `<Blandas />`

**Out of scope:**
- Inputs de usuario (página estática)
- Conexión a Supabase
- Cálculos dinámicos

## Approach

Static data first → components → page → route. Sin lógica de estado, sin efectos.

## Key Decisions

1. **Card-based layout**: misma estructura visual que Calcular (cards con header, icon + título)
2. **Datos inline en components**: los datos son tan pequeños que van en los mismos componentes, no en data/blandas.ts (pero PRD dice data/blandas.ts así que lo respetamos)
3. **Sin Zustand**: no necesita store — es pura presentación

## Risks

Ninguno. Es la página más simple del sistema — solo HTML semántico con Tailwind.
