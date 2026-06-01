# Design: fase-3-dietas-blandas

## File Structure

```
src/
├── pages/
│   └── Blandas.tsx               ← Ensambla todo
├── components/
│   └── blandas/
│       ├── TablaChinos.tsx        ← Tabla de chinos (3 tipos)
│       ├── TablaMolido.tsx        ← Ingredientes del molido
│       └── TablaPure.tsx          ← Tabla del puré
└── data/
    └── blandas.ts                 ← Datos estáticos de dietas blandas
```

## Component Tree

```
<Blandas>
  <Header />                       ← "Dietas Blandas" + subtitle + badge
  <TablaChinos />                  ← Card + tabla de 3 chinos
  <TablaMolido />                  ← Card + ingredientes + proteína variable
  <TablaPure />                    ← Card + tabla de puré
  <Resumen />                      ← Card + badge 48 bolsas + desglose
</Blandas>
```

## State

None. Zero state. Purely presentational — all data is static constants.

## Data (src/data/blandas.ts)

```typescript
export interface Chino {
  tipo: string
  ingredientes: string
  bolsas: number
  brutoKg: number
}

export interface MolidoIngrediente {
  nombre: string
  cantidad: string
}

export interface MolidoProteina {
  tipo: string
  kgBruto: number
}

export interface PureData {
  bolsasPapa: number
  mermaP: number
  papaCocidaKg: number
}
```

## Visual Design

- Cards: white surface, 14px padding, 12px border-radius, shadow-sm
- Card headers: icon (17px, accent color `#1B5E3F`) + title (14px, semibold, text `#1A1917`) + subtitle (12px, text2 `#6B6860`)
- Tables: header row (11px, semibold, text2), data rows (13px, text), alternating bg
- Numbers: DM Mono font, 15px/500
- Badge "48": DM Mono, 28px, accent bg, white text
- Mobile-first: full width, single column, scroll

## Implementation Order

| # | Step | Verify |
|---|------|--------|
| 1 | Create `src/data/blandas.ts` | Data exports correctly |
| 2 | Create `TablaChinos.tsx` | Renders 3 chinos |
| 3 | Create `TablaMolido.tsx` | Renders ingredients + protein |
| 4 | Create `TablaPure.tsx` | Renders pure data |
| 5 | Create `Blandas.tsx` | Page assembles all |
| 6 | Update `App.tsx` route | Route shows page |
| 7 | `tsc --noEmit` | Zero errors |
| 8 | `npm run build` | Build succeeds |
