## Spec: fase-2-calculadora

### Servicio Toggle

**Almuerzo / Cena switch**
- Given: page loads, default service is "Almuerzo"
  Then: toggle shows "Almuerzo" active (green `#1B5E3F` bg, white text), "Cena" inactive (transparent bg, gray text)
  Then: centros load almuerzo values (Sur=120, Candelaria=120, Parque=50, Centro=100, HogarA=12, HogarB=12)
  Then: total shows 414
  Then: accent color is green `#1B5E3F` throughout
- Given: user taps "Cena"
  Then: "Cena" becomes active (blue `#1E3A5F` bg, white text), "Almuerzo" becomes inactive
  Then: centros load cena values (Sur=120, Candelaria=30, Parque=50, Centro=100, HogarA=12, HogarB=12)
  Then: total shows 324
  Then: accent color changes to blue `#1E3A5F` throughout
- Given: user changes a patient value and toggles service
  Then: values reset to defaults for the selected service
  Then: any previously entered custom values are discarded

### Centros Grid

**Display**
- Given: grid shows 6 centers in 2-column layout (3 rows × 2 cols)
- Each center shows: colored dot (centro color) + name + number input
- Input type: number, min=0, centered text, DM Mono font
- Background: white card with 12px border radius

**Total bar**
- Below the grid: colored bar showing service name, "Total pacientes" label, and the sum in large DM Mono font (28px)
- Color matches the active service (green for almuerzo, blue for cena)
- Shows user icon on the right

**Editing**
- Given: user changes any patient input
  Then: total recalculates immediately
  Then: "Calcular" button label updates to "Calcular {Servicio} — {total} pac."
- Given: user enters a negative number or non-numeric
  Then: input defaults to 0
- Given: total is 0
  Then: "Calcular" button shows "Calcular {Servicio} — 0 pac."

### Plato Item

**Structure**
- Given: page loads with NO platos
  Then: show "Añadir otro plato" button in the platos card
- Given: user taps "Añadir otro plato" or a quick preset
  Then: a new PlatoItem is added to the list
- Given: the first plato is added
  Then: it has a default example: "Muslo de pollo" with preset values (20 caja, 2 ración) + "Arroz" as garnish (2.5kg, 120g/ración) + no second garnish

**Header**
- Text input for plato name with placeholder "Nombre del plato"
- Delete button (X icon) on the right — removes the plato
- Background: white header, gray body

**Proteína section**
- Quick preset chips: Muslo pollo, Contramuslo, Pescado, Albóndigas, Hamburguesa, Quiché
- Given: user taps a preset chip
  Then: auto-fills: nombre, unidades/caja, unidades/ración, nombre unidad, y merma
  Then: the chip becomes "selected" (green bg, white text)
- Given: user selects "Muslo pollo" preset
  Then: caja=20, ración=2, unidad="muslos", merma=30% (auto)
- Given: user selects "Albóndigas" preset
  Then: caja=52, ración=5, unidad="albóndigas", merma=20% (auto)
- Given: user types a custom name in the plato header
  Then: auto-detect merma for proteína by substring matching on the plato name
  Then: show "auto" (green tag) if matched, "manual" (amber tag) if not
  Then: show source tooltip below merma (e.g., "Muslo/pernil horno ~30%")

**Guarnición section**
- Quick preset chips (as buttons in a grid): Arroz, Macarrones, Habichuelas, Coliflor, Brócoli, Menestra, Zanahoria, Col Bruselas, Papas dólar, Puré de papa
- Given: user taps a preset chip
  Then: auto-fills the garnish name, and merma for that ingredient
  Then: the chip becomes "selected"
- Given: user selects "Arroz"
  Then: merma=-200% (auto tag), source shows "Arroz: absorbe agua, triplica peso (factor ×3)"
- Given: user selects "Habichuelas"
  Then: merma=22% (auto tag)
- Given: user types a custom garnish name
  Then: auto-detect merma for garnish by substring matching
- Field: Bolsa (kg) — default 2.5, configurable
- Field: Merma % — with auto/manual tag
- Field: g netos/ración — default 120 (or 60 if second garnish active)

**Segunda guarnición**
- Toggle button: "+ Añadir segunda guarnición" / "Quitar segunda guarnición"
- Given: user activates second garnish
  Then: second garnish section appears
  Then: first garnish g/ración changes to 60
  Then: second garnish default g/ración is 60
  Then: total garnish per patient stays at 120g (60+60)
- Given: user deactivates second garnish
  Then: second garnish section is hidden
  Then: first garnish g/ración returns to 120

### Mermas Automáticas

- Given: user types text in any name field (plato, garnish)
  Then: system searches the MERMAS table by substring matching (case-insensitive)
  Then: if match found → auto-fill merma %, tag="auto" (green), show source text
  Then: if no match → tag="manual" (amber), show "Sin dato automático — ajusta manualmente"
- Given: user manually changes the merma value
  Then: tag changes from "auto" to "manual" (amber)
- Given: user changes the name field after manual merma edit
  Then: re-run auto-detection; if new match found, overwrite with auto value and tag
- The MERMAS table matches the same data as PROTOTYPE.html (16 proteins + 17 garnishes)

### Cálculo

**Calculate button**
- Full width, accent color, calculator icon + "Calcular {Servicio} — {total} pac."
- Given: user taps "Calcular"
  Then: show validation error if no platos added: "Añadí al menos un plato"
  Then: show validation error if no patients: "Introducí el número de pacientes"
  Then: scroll to results section

**Results display**
- Each plato renders a result card with header (plato name + service)
- Proteína bloque: cajas a abrir (BIG number), unidades disponibles, unidades necesarias, sobrante + raciones extra, desglose por centro (colored pills)
- Guarnición 1 bloque: bolsas a abrir (BIG), peso bruto, peso neto, sobrante + raciones extra
- Guarnición 2 bloque: same format (if active)
- Merma label changes: "Merma X%" for positive, "Peso en seco (absorbe ×X)" for negative

**Proteína calculation formula** (from PRD section 8):
```
unidades_necesarias = unidades_por_ración × total_pacientes
cajas = CEIL(unidades_necesarias / unidades_por_caja)
sobrante = (cajas × unidades_por_caja) - unidades_necesarias
sobrante_raciones = FLOOR(sobrante / unidades_por_ración)
```

**Guarnición calculation formula** (from PRD section 8):
```
neto_necesario = g_por_ración × total_pacientes
if merma < 0 (absorción):
  factor = 1 + |merma%|
  bruto = neto_necesario / factor
  bolsas = CEIL(bruto / (bolsa_kg × 1000))
  neto_real = bolsas × (bolsa_kg × 1000) × factor
else:
  bruto = neto_necesario / (1 - merma%)
  bolsas = CEIL(bruto / (bolsa_kg × 1000))
  neto_real = bolsas × (bolsa_kg × 1000) × (1 - merma%)
sobrante = neto_real - neto_necesario
```

**Desglose por centro**:
- Each center shows: colored pill with center name + units needed for that center
- Format: "{nombre}: {unidades} {unidad}"
- Background pill color = center color at 13% opacity, text = center color

### Autenticación Custom (revisión de arquitectura)

**Reemplazo completo de Supabase Auth**

- **Eliminar**: `supabase.auth.signInWithPassword()`, `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange()`, `supabase.auth.signOut()`
- **Nuevo flujo**:
  1. `signIn(username, pin)` → query `usuarios` table WHERE `username = ? AND activo = true`
  2. Client-side bcrypt compare between input PIN and `pin_hash` from DB
  3. If match → save session to localStorage: `{ id, username, nombre_completo, rol }`
  4. If no match → return error "Usuario o PIN incorrecto"
  5. `signOut()` → clear localStorage session item
  6. On mount → read session from localStorage, set loading=false

**Perfil de usuario autenticado**:
```typescript
interface UserProfile {
  id: string
  username: string
  nombre_completo: string
  rol: string
}
```

**Tabla `usuarios` en Supabase** (ya existe):
```
id (uuid), username (text), nombre_completo (text), rol (text), centro_id (uuid), activo (boolean), pin_hash (text)
```

**Validaciones**:
- Username: `!username.trim()` → "Ingresá tu usuario"
- PIN: debe tener 4 dígitos numéricos exactos → "El PIN debe tener 4 dígitos"
- Conexión: si `supabase.from('usuarios')` falla → "Error de conexión. Verificá tu conexión a internet."
- Usuario inactivo o no encontrado → "Usuario o PIN incorrecto"
- PIN incorrecto (bcrypt no coincide) → "Usuario o PIN incorrecto"

**Arquitectura migrable**:
- El hook `useAuth` expone la misma interfaz pública (`signIn`, `signOut`, `session`/`loading`)
- Los componentes consumidores (`Login.tsx`, `ProtectedLayout.tsx`) NO cambian su lógica
- Para migrar a Supabase Auth o OAuth en el futuro: solo tocar `useAuth.ts`

### Edge Cases

- **Total pacientes = 0**: Button shows "Calcular {Servicio} — 0 pac.", tapping shows error
- **Sin platos**: "Añadí al menos un plato" error toast/message
- **Unidades/caja = 0**: For Quiché — show "Elaboración propia" or mark as variable. PROTOTYPE.html handles this with caja=0
- **Sobrante = 0**: Show green checkmark "✓" next to sobrante
- **Sobrante > 0**: Show "+{X}g → {Y} rac. extra" in warn color
- **Merma > 100%**: Not possible in normal use (max is 40%), but guard against division by zero in (1 - merma%)
- **Bolsa kg = 0**: Prevent — default to 2.5, min 0.1
- **Network unavailable**: Calculator works fully offline — no network calls needed
