# AGENTS.md — CocinerHosp

> Reglas de desarrollo para todos los agentes AI que trabajen en este proyecto.
> Leer OBLIGATORIAMENTE antes de escribir cualquier código.

---

## 1. Contexto del Proyecto

**CocinerHosp** es una PWA mobile-first para gestión de producción en un comedor hospitalario en Tenerife, España. Los usuarios son chefs que usan la app en el teléfono dentro de una cocina industrial.

Lee el `PRD.md` completo antes de comenzar. Contiene toda la lógica de negocio.

---

## 2. Stack Obligatorio

```
React 18 + TypeScript (strict)
Vite + vite-plugin-pwa
Tailwind CSS (usando los design tokens de src/theme/colors.ts)
Zustand (estado global — NO usar Context para estado compartido)
Supabase (auth + database + realtime)
React Router v6
```

**NO usar:**
- Redux (Zustand es suficiente)
- Axios (usar fetch nativo o Supabase client)
- Moment.js (usar date-fns o Intl nativo)
- CSS modules (solo Tailwind)
- `any` en TypeScript

---

## 3. Reglas de Código

### TypeScript
- Siempre `strict: true`
- Nunca usar `any` — usar `unknown` si el tipo no está claro
- Todos los props de componentes tipados con interfaces
- Todos los retornos de funciones con tipo explícito
- Usar `zod` para validar datos que vienen de Supabase

### Componentes React
- Siempre componentes funcionales con arrow functions
- Nombrar archivos en PascalCase: `PlatoItem.tsx`
- Un componente por archivo
- Props interface justo antes del componente, no en archivo separado
- Máximo 150 líneas por componente — si se pasa, extraer subcomponentes

### Funciones de cálculo (src/lib/calculos.ts)
- **FUNCIONES PURAS** — sin side effects, sin acceso a estado global
- Siempre retornan tipos explícitos
- Siempre tienen tests en `calculos.test.ts`
- Los cálculos de merma DEBEN seguir exactamente la fórmula del PRD

### Supabase
- Cliente singleton en `src/lib/supabase.ts`
- Todas las queries en los hooks (`src/hooks/`)
- Nunca hacer queries directamente en componentes
- Manejar siempre los casos de error

### Estilos
- Solo Tailwind CSS
- Los colores del tema DEBEN venir de `src/theme/colors.ts`
- Diseño mobile-first (pantalla ~390px como referencia)
- Usar las variables CSS del prototipo HTML de referencia

---

## 4. Lógica de Negocio Crítica

### ⚠️ NUNCA cambiar estas reglas sin leer el PRD primero:

**Ración estándar:**
- Proteína: 120g neto cocido por paciente
- Guarnición: 120g neto cocido por paciente
- Con 2 guarniciones: 60g + 60g (total sigue siendo 120g)

**Cálculo proteína — por UNIDADES no por peso:**
```
unidades_necesarias = unidades_por_racion × total_pacientes
cajas = CEIL(unidades_necesarias / unidades_por_caja)
```

**Cálculo guarnición — por BOLSAS congeladas de 2.5kg:**
```
neto_necesario = racion_g × total_pacientes
bruto = neto_necesario / (1 - merma%)
bolsas = CEIL(bruto / 2500g)
```

**Absorción (arroz/pasta — merma negativa):**
```
factor = 1 + |merma%|
bruto = neto_necesario / factor
bolsas = CEIL(bruto / 2500g)
neto_real = bolsas * 2500g * factor
```

**Muslo de pollo:**
- 2 muslos por ración (NO 1)
- 20 muslos por caja
- Bandejas de horno: 25 muslos por bandeja

**Centros — cargar SIEMPRE según servicio:**
```
Almuerzo: Sur(120), Candelaria(120), Parque(50), Centro(100), HogarA(12), HogarB(12) = 414
Cena:     Sur(120), Candelaria(30),  Parque(50), Centro(100), HogarA(12), HogarB(12) = 324
```

**Dietas blandas — valores FIJOS (no calcular):**
- Puré: siempre 32 bolsas de papa congelada (2.5kg)
- Chino zanahoria: 2 bolsas papa + 2 bolsas zanahoria
- Chino calabaza: 2 bolsas papa + 2 bolsas calabaza
- Chino calabacín: 3 bolsas papa + 2 bolsas calabacín
- Molido: 2 bolsas calabacín + 1 bolsa zanahoria + frescos

---

## 5. Estructura de Archivos

Seguir EXACTAMENTE la estructura definida en el PRD (sección 7).

```
src/
├── pages/          ← Vistas completas (una por tab)
├── components/     ← Componentes reutilizables
│   ├── layout/     ← TopBar, BottomNav
│   ├── calcular/   ← Componentes específicos de la calculadora
│   ├── blandas/    ← Componentes de dietas blandas
│   └── ui/         ← Componentes base (Card, Button, Input, Badge)
├── data/           ← Datos estáticos (mermas, presets, centros)
├── hooks/          ← Custom hooks (Supabase queries)
├── lib/            ← Utilidades puras (supabase client, calculos)
├── store/          ← Zustand stores
└── theme/          ← Design tokens
```

---

## 6. Proceso de Desarrollo (SDD)

### Antes de implementar cualquier feature:
1. Leer la sección correspondiente del PRD
2. Verificar que la lógica de cálculo coincide con las fórmulas del PRD
3. Crear tests para las funciones de `calculos.ts` ANTES de implementarlas

### Al crear un componente nuevo:
1. Definir la interface de props primero
2. Escribir el componente con datos mockeados
3. Conectar con hooks/stores
4. Verificar en viewport móvil (390px)

### Al hacer un commit:
1. Los cálculos deben pasar todos los tests
2. No debe haber errores de TypeScript (`tsc --noEmit`)
3. No debe haber errores de ESLint

---

## 7. UX / Diseño Mobile

### Reglas de interfaz:
- Todos los botones de acción principal: mínimo 44px de alto (accesibilidad táctil)
- Fuente base: 14px (legible con guantes)
- Inputs numéricos: teclado numérico (`inputMode="numeric"`)
- Feedback visual inmediato en todos los cálculos
- Sin modales innecesarios — usar expansión inline
- La etiqueta "auto" (verde) vs "manual" (ámbar) en campos de merma

### Paleta (del PRD sección 6):
- Verde almuerzo: `#1B5E3F`
- Azul cena: `#1E3A5F`
- Fondo: `#F4F3EF`
- Texto: `#1A1917`

### Referencia visual:
El archivo `PROTOTYPE.html` es la **fuente de verdad** para el diseño.
Replicar exactamente: colores, bordes, espaciados, tipografía.

---

## 8. Supabase — Reglas de Integración

### Auth
- Usuario se identifica con `username` (texto corto) + PIN de 4 dígitos
- El PIN se hashea antes de guardar (Supabase Auth maneja esto)
- Session persiste en localStorage via Supabase client

### Queries
- Siempre usar Row Level Security (RLS) en Supabase
- Chef solo ve SUS propios registros (a menos que sea supervisor)
- Supervisor puede ver todos

### Offline
- Los centros y mermas se cargan desde `src/data/` como fallback local
- Los registros se intentan guardar online; si falla, mostrar error claro
- La calculadora funciona 100% offline (no necesita Supabase)

---

## 9. Testing

```
vitest (unit tests)
@testing-library/react (component tests)
```

**Tests obligatorios en `src/lib/calculos.test.ts`:**

```typescript
// Casos que DEBEN tener test:
// 1. Albóndigas: 5 × 414 = 2070 necesarias → CEIL(2070/52) = 40 cajas
// 2. Muslo: 2 × 50 = 100 muslos → CEIL(100/20) = 5 cajas, 0 sobrante
// 3. Guarnición habichuelas (22% merma): 50 pac → neto=6000g, bruto=7692g → 4 bolsas
// 4. Arroz (absorción ×3): 50 pac → neto=6000g, bruto=2000g → 1 bolsa
// 5. Hamburguesa: 1 × 414 = 414 → CEIL(414/52) = 8 cajas, sobrante=2
```

---

## 10. Qué NO hacer

- ❌ No inventar lógica de cálculo — todo está en el PRD
- ❌ No cambiar los valores de pacientes por centro sin actualizar ambos (almuerzo Y cena)
- ❌ No usar `useEffect` para cálculos — usar funciones puras en `calculos.ts`
- ❌ No hardcodear colores en JSX — usar siempre las clases Tailwind del theme
- ❌ No hacer queries SQL directas en componentes — siempre via hooks
- ❌ No olvidar que muslo = 2 unidades por ración
- ❌ No olvidar que con 2 guarniciones cada una es 60g (no 120g)
- ❌ No usar `localStorage` directamente — Supabase client maneja la sesión
