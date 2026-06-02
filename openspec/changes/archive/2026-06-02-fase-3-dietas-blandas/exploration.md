# Exploration: fase-3-dietas-blandas

## Contexto

Los chefs preparan DIARIAMENTE dietas blandas — purés, chinos (triturados) y molido — para pacientes con dificultad para tragar o dietas especiales. Son cantidades FIJAS, no dependen del número de pacientes del día.

Actualmente no hay pantalla para consultar estas cantidades. Los chefs necesitan saber rápido cuántas bolsas de cada verdura congelada abrir cada día.

## Requisitos del PRD

### Fuente
PRD Sección 1.6 "Producción Fija Diaria — Dietas Blandas" + AGENTS.md sección 4.

### Scope
- Pantalla ESTÁTICA (no inputs, no cálculos)
- 3 tablas + resumen de 48 bolsas/día
- Navegación desde BottomNav (tab "Blandas", ya existe en App.tsx como PlaceholderPage)

### Datos que mostrar

**Chinos (triturados)** — 22 barquetas × 3kg = 66kg/día
| Tipo | Ingredientes | Bolsas | Bruto |
|------|-------------|--------|-------|
| Zanahoria | 2 papa + 2 zanahoria | 4 | 10 kg |
| Calabaza | 2 papa + 2 calabaza | 4 | 10 kg |
| Calabacín | 3 papa + 2 calabacín | 5 | 12.5 kg |

**Molido (caldo espesado)** — 20 barquetas × 3kg = 60kg/día
| Ingrediente | Cantidad |
|-------------|----------|
| Calabacín congelado | 2 bolsas (5 kg) |
| Zanahoria congelada | 1 bolsa (2.5 kg) |
| Cebolla fresca | ~1 kg |
| Pimiento fresco | ~1 kg |
| Ajo | ~100 g |
| Cilantro | ~50 g |
| Fécula de maíz | ~400 g |
| Agua/caldo | hasta 60 kg |
| Proteína (variable) | Pollo: 8.6 kg / Cerdo: 7.3 kg |

**Puré de papas** — 22 barquetas × 3kg = 66kg/día
| Ingrediente | Cantidad |
|-------------|----------|
| Papas congeladas (2.5kg) | 32 bolsas (80 kg bruto) |
| Merma 15% | −12 kg |
| Papa cocida disponible | ~68 kg |

**Resumen**: 48 bolsas congeladas/día (39 papas, 3 zanahoria, 2 calabaza, 4 calabacín)

## Archivos a crear/modificar

- `src/data/blandas.ts` — datos estáticos (nuevo)
- `src/components/blandas/TablaChinos.tsx` — tabla de chinos (nuevo)
- `src/components/blandas/TablaMolido.tsx` — tabla de molido (nuevo)
- `src/components/blandas/TablaPure.tsx` — tabla de puré (nuevo)
- `src/pages/Blandas.tsx` — página principal (nuevo)
- `src/App.tsx` — reemplazar PlaceholderPage por <Blandas /> (modificar)

## Riesgos

- Ninguno — es una página estática sin lógica de cálculo ni conexión a Supabase
- Diseño debe ser coherente con el resto de la app (mobile-first, colores, tipografía)
