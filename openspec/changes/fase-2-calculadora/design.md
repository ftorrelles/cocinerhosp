## Design: fase-2-calculadora

### File Structure

```
src/
├── pages/
│   └── Calcular.tsx              ← Ensambla todos los componentes
├── components/
│   └── calcular/
│       ├── ServicioToggle.tsx    ← Almuerzo/Cena switch
│       ├── CentrosGrid.tsx       ← 6 centros con inputs
│       ├── PlatoItem.tsx         ← Contenedor de plato
│       ├── ProteinaSection.tsx   ← Presets + campos proteína
│       ├── GuarnicionSection.tsx ← Presets + campos guarnición
│       └── ResultadoPlato.tsx    ← Resultados desglosados
├── data/
│   ├── centros.ts               ← 6 centros con valores fijos
│   ├── mermas.ts                ← Tabla de mermas (33 entries)
│   ├── proteinaPresets.ts       ← 6 presets de proteína
│   └── guarnicionPresets.ts     ← 10 presets de guarnición
├── hooks/
│   └── useCalculo.ts            ← Orquesta cálculos
├── lib/
│   ├── calculos.ts              ← Funciones puras
│   └── calculos.test.ts         ← Tests obligatorios
└── store/
    └── useAppStore.ts           ← Zustand store
```

### Component Tree

```
<Calcular>
  <Card "Servicio">
    <ServicioToggle />           ← estado: servicio actual
    <CentrosGrid />              ← estado: centros con valores
    <TotalBar />                  ← suma de pacientes
  </Card>

  <Card "Platos del servicio">
    {platos.map(p => <PlatoItem>)}
      <ProteinaSection />        ← presets + campos
      <GuarnicionSection />      ← presets + campos + toggle 2da
    <Button "Añadir otro plato" />
  </Card>

  <Card "Calcular">
    <Button "Calcular..." />
    {resultados.map(r => <ResultadoPlato>)}
      <ResProteina />            ← cajas, unidades, sobrante
      <ResGuarnicion />          ← bolsas, kg, sobrante
      <DesgloseCentros />        ← pills por centro
  </Card>
</Calcular>
```

### State Design (Zustand)

```typescript
// src/store/useAppStore.ts

interface Plato {
  id: string
  nombre: string

  // Proteína
  unidadesPorCaja: number
  unidadesPorRacion: number
  nombreUnidad: string
  mermaProteina: number        // %
  mermaProtAuto: boolean       // true = "auto", false = "manual"
  mermaProtSource: string

  // Guarnición 1
  guar1Nombre: string
  guar1BolsaKg: number
  guar1Merma: number
  guar1MermaAuto: boolean
  guar1MermaSource: string
  guar1Gramos: number

  // Guarnición 2
  guar2Activa: boolean
  guar2Nombre: string
  guar2BolsaKg: number
  guar2Merma: number
  guar2MermaAuto: boolean
  guar2MermaSource: string
  guar2Gramos: number
}

interface AppState {
  servicio: 'almuerzo' | 'cena'
  pacientes: Record<string, number>   // centroId → pax
  platos: Plato[]
  resultados: Resultado[] | null      // calculados

  setServicio: (s: 'almuerzo' | 'cena') => void
  setPaciente: (centroId: string, valor: number) => void
  addPlato: (preset?: Partial<Plato>) => void
  removePlato: (id: string) => void
  updatePlato: (id: string, changes: Partial<Plato>) => void
  toggleGuar2: (id: string) => void
  calcular: () => void       // corre cálculos y guarda en resultados
  resetResultados: () => void
}

// Initial plato (when none exist, add with defaults)
const platoVacio = (): Plato => ({
  id: crypto.randomUUID(),
  nombre: '',
  unidadesPorCaja: 52,
  unidadesPorRacion: 1,
  nombreUnidad: 'piezas',
  mermaProteina: 25,
  mermaProtAuto: false,
  mermaProtSource: 'Escribe el nombre para autocompletar',
  guar1Nombre: '',
  guar1BolsaKg: 2.5,
  guar1Merma: 20,
  guar1MermaAuto: false,
  guar1MermaSource: '',
  guar1Gramos: 120,
  guar2Activa: false,
  guar2Nombre: '',
  guar2BolsaKg: 2.5,
  guar2Merma: 15,
  guar2MermaAuto: false,
  guar2MermaSource: '',
  guar2Gramos: 60,
})
```

### Data Flow

```
User taps preset chip
  → store.updatePlato(id, { unidadesPorCaja: 20, ... })
  → PlatoItem re-renders with new values

User types garnish name
  → onInput handler calls detectMerma(texto, 'guar')
  → if match: store.updatePlato(id, { guar1Merma: X, guar1MermaAuto: true, ... })
  → if no match: store.updatePlato(id, { guar1MermaAuto: false })

User taps "Calcular"
  → store.calcular()
  → reads all platos from store
  → for each plato:
      → calcularProteina(pacientes, unidadesPorCaja, unidadesPorRacion, mermaP)
      → calcularGuarnicion(pacientes, bolsaKg, merma, racionG)
      → calcularDesgloseCentros(pacientes, servicio, unidadesPorRacion)
  → store.resultados = [...]
  → ResultadoPlato renders each result

User toggles service
  → store.setServicio('cena')
  → resets pacientes to cena defaults
  → resets resultados to null
  → CentrosGrid + TotalBar + Calcular button re-render
```

### Key Types (calculos.ts)

```typescript
export interface ProteinaResult {
  unidadesNecesarias: number
  cajasAbrir: number
  unidadesDisponibles: number
  sobrante: number
  sobranteRaciones: number
  bandejasHorno?: number
  mermaP: number
}

export interface GuarnicionResult {
  netoNecesario: number
  brutoNecesario: number
  netoReal: number
  bolsas: number
  sobrante: number
  mermaP: number
}

export interface DesgloseCentro {
  nombre: string
  color: string
  pax: number
  unidades: number
}

export interface ResultadoPlato {
  nombre: string
  proteina: ProteinaResult
  unidadesPorRacion: number
  nombreUnidad: string
  guar1: GuarnicionResult
  guar1Nombre: string
  guar1Gramos: number
  guar2: GuarnicionResult | null
  guar2Nombre: string | null
  guar2Gramos: number | null
  desglose: DesgloseCentro[]
  servicio: string
  mermaProtP: number
}
```

### Merma Detection

```typescript
// Replicar exactamente la función del PROTOTYPE.html

interface MermaEntry {
  keywords: string[]       // nombres a buscar
  protMerma?: number       // % para proteína (si aplica)
  guarMerma?: number       // % para guarnición (si aplica, negativo = absorción)
  source: string           // texto de fuente
}

function detectarMerma(
  texto: string,
  tipo: 'prot' | 'guar',
  tabla: MermaEntry[]
): { merma: number; source: string; found: boolean } {
  // substring matching case-insensitive
  // recorre tabla, busca match en keywords
  // retorna primer match encontrado
}
```

### Implementation Order

| # | Step | Verify |
|---|------|--------|
| 1 | Create `src/data/centros.ts`, `mermas.ts`, `proteinaPresets.ts`, `guarnicionPresets.ts` | Data imports correctly |
| 2 | Create `src/lib/calculos.ts` with 4 pure functions | Types are correct |
| 3 | Create `src/lib/calculos.test.ts` — 5 mandatory test cases | `vitest run` passes |
| 4 | Create `src/store/useAppStore.ts` | Store actions work |
| 5 | Create `src/hooks/useCalculo.ts` | Hook orchestrates correctly |
| 6 | Create `src/components/calcular/ServicioToggle.tsx` | Toggle switches service |
| 7 | Create `src/components/calcular/CentrosGrid.tsx` | Grid renders 6 centers |
| 8 | Create `src/components/calcular/ProteinaSection.tsx` | Presets fill fields |
| 9 | Create `src/components/calcular/GuarnicionSection.tsx` | Presets + 2da toggle work |
| 10 | Create `src/components/calcular/PlatoItem.tsx` | Multiple platos work |
| 11 | Create `src/components/calcular/ResultadoPlato.tsx` | Results render correctly |
| 12 | Create `src/pages/Calcular.tsx` | Page assembles all components |
| 13 | Update `src/App.tsx` — replace `/` placeholder with `<Calcular />` | Route shows calculator |
| 14 | Run `npx tsc --noEmit` | Zero errors |
| 15 | Run `npm run build` | Build succeeds |

### Auth Custom — Arquitectura

#### Flujo de Login

```
Usuario ingresa username + PIN
  → useAuth.signIn(username, pin)
  → Valida formato (username no vacío, PIN 4 dígitos)
  → supabase.from('usuarios').select('*').eq('username', username).eq('activo', true).single()
  → Si no encuentra usuario o inactivo → "Usuario o PIN incorrecto"
  → bcrypt.compare(pin, usuario.pin_hash)
  → Si no coincide → "Usuario o PIN incorrecto"
  → localStorage.setItem('cocinerhosp_session', JSON.stringify({ id, username, nombre_completo, rol }))
  → Retorna { error?: string }

Auth check on app mount:
  → localStorage.getItem('cocinerhosp_session')
  → Si existe → parse → setUser(profile) → loading=false
  → Si no existe → user=null → loading=false

Logout:
  → localStorage.removeItem('cocinerhosp_session')
  → setUser(null)
```

#### Interfaz Pública (sin cambios para consumidores)

```typescript
interface UseAuthReturn {
  user: UserProfile | null     // antes: User | null (de Supabase)
  session: UserProfile | null  // antes: Session | null (de Supabase)
  loading: boolean
  signIn: (username: string, pin: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}
```

**Clave de migración**: `session` cambia de tipo (`Session` → `UserProfile | null`), pero todos los consumidores solo verifican `if (session)` como truthy/falsy. No acceden a propiedades internas de `Session`. Esto hace que el cambio sea transparente para Login.tsx y ProtectedLayout.tsx.

#### Dependencias nuevas
- `bcryptjs` (runtime) — para comparar PIN

#### Sesión en localStorage
- Key: `cocinerhosp_session`
- Value: `JSON.stringify({ id, username, nombre_completo, rol })`
- Se borra en signOut
- No expira por ahora (igual que Supabase Auth persistence)

### Design Notes (from PROTOTYPE.html)

- **Card headers**: icon (17px, accent color) + title (14px, semibold) with 7px gap
- **Chips**: rounded (20px), 4px 10px padding, 12px font, border `#D9D7CF`, selected = accent green bg
- **Quick preset buttons**: 3-column grid, 8px 4px padding, 11px font, icon above text
- **Grid inputs**: centered DM Mono, 15px weight 500
- **Total bar**: accent bg, white text, 28px DM Mono for number
- **Merma field**: input with 48px right padding for tag, absolute positioned tag
- **Results**: BIG numbers (20px, DM Mono, accent color)
- **Centro pills**: 3px 8px padding, 10px, DM Mono, colored bg/text
- **Spacing**: 14px card padding, 10px between cards, 8px grid gap
