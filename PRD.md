# PRD: CocinerHosp — Sistema de Gestión de Producción para Comedor Hospitalario

> **PWA mobile-first para chefs de comedor hospitalario en Tenerife, España.**
> Calcula producción, gestiona dietas especiales y genera historial por chef.

**Versión**: 1.0.0
**Estado**: Listo para desarrollo
**Plataforma objetivo**: PWA (iOS + Android via navegador, instalable)

---

## 1. Contexto del Negocio

El cliente gestiona la producción culinaria de un comedor hospitalario en Tenerife que sirve **dos servicios diarios** (almuerzo y cena) a **6 centros** con capacidades distintas. Los chefs necesitan calcular rápidamente cantidades exactas de producción basadas en el número de pacientes, tipo de proteína, guarnición y dietas especiales.

### 1.1 Los 6 Centros y sus Pacientes

| Centro | Almuerzo | Cena |
|--------|----------|------|
| Sur | 120 | 120 |
| Candelaria | 120 | 30 |
| Parque | 50 | 50 |
| Centro | 100 | 100 |
| Hogar A | 12 | 12 |
| Hogar B | 12 | 12 |
| **TOTAL** | **414** | **324** |

### 1.2 Estándares de Ración

- **Proteína**: 120g por paciente (neto cocido)
- **Guarnición**: 120g por paciente (neto cocido)
- **Con 2 guarniciones**: 60g + 60g (misma bandeja)
- **Bandeja total**: 240g (120g proteína + 120g guarnición)

### 1.3 Lógica de Proteínas (por unidades/cajas)

Las proteínas NO se calculan por peso sino por **unidades en caja**:

| Proteína | Unidades/caja | Unidades/ración | Notas |
|----------|--------------|-----------------|-------|
| Muslo de pollo | 20 | 2 muslos | Con hueso |
| Contramuslo de pollo | 20 | 1 contramuslo | |
| Pescado (filetes) | 10 | 1 filete | Varía según tipo |
| Albóndigas | 52 | 5 albóndigas | |
| Carne hamburguesa | 52 | 1 carne | |
| Quiché (huevo líquido + queso + jamón) | Variable | 1 porción | Elaboración propia |

**Regla de cálculo**:
```
unidades_necesarias = unidades_por_racion × total_pacientes
cajas_a_abrir = CEIL(unidades_necesarias / unidades_por_caja)
sobrante = (cajas_a_abrir × unidades_por_caja) - unidades_necesarias
```

#### Bandejas de horno para muslo de pollo
```
bandejas_horno = CEIL(unidades_necesarias / capacidad_bandeja)
```
Capacidad estándar: 25 muslos por bandeja de horno.

### 1.4 Lógica de Guarniciones (por bolsas congeladas)

Las guarniciones vienen en **bolsas congeladas de 2.5 kg** y tienen merma al cocer.

**Regla de cálculo**:
```
neto_necesario = 120g × total_pacientes   (o 60g si hay 2 guarniciones)
bruto_necesario = neto_necesario / (1 - merma%)
bolsas_a_abrir = CEIL(bruto_necesario / 2500g)
neto_real = (bolsas × 2500g) × (1 - merma%)
sobrante = neto_real - neto_necesario
```

**Excepción absorción** (arroz, pasta): el producto seco absorbe agua y aumenta de peso.
```
Factor arroz: ×3 (100g seco → 300g cocido)
Factor pasta/macarrones: ×2.5
bruto_necesario = neto_necesario / factor
```

### 1.5 Tabla de Mermas (fuentes profesionales industriales)

#### Proteínas
| Ingrediente | Merma cocción |
|-------------|--------------|
| Muslo de pollo (horno) | 30% |
| Contramuslo de pollo (horno) | 26% |
| Pescado blanco (horno) | 20% |
| Albóndigas (cocidas) | 20% |
| Carne hamburguesa (plancha) | 25% |
| Quiché / huevo (horno) | 10% |
| Pechuga de pollo | 37% |
| Cerdo magro | 18% |
| Ternera/vacuno | 27% |

#### Guarniciones congeladas
| Ingrediente | Merma cocción |
|-------------|--------------|
| Habichuelas/judías verdes | 22% |
| Coliflor | 25% |
| Brócoli | 40% |
| Menestra | 22% |
| Zanahoria | 20% |
| Col de Bruselas | 18% |
| Papas dólar (precocidas) | 12% |
| Patatas/papas cocidas | 15% |
| Puré de papa (sobre/bolsa) | 5% |
| Papas/patatas fritas congeladas | 15% |
| Arroz | −200% (absorción ×3) |
| Macarrones/pasta seca | −150% (absorción ×2.5) |
| Espinacas | 35% |
| Acelgas | 40% |
| Champiñones | 35% |
| Pimientos | 18% |

### 1.6 Producción Fija Diaria — Dietas Blandas

Se preparan **diariamente** independientemente del servicio:

#### Chinos (triturados) — 22 barquetas × 3kg = 66kg/día

Cada barqueta = 3kg. Cada bolsa congelada = 2.5kg.

| Tipo | Ingredientes | Bolsas | Bruto total |
|------|-------------|--------|-------------|
| Zanahoria | 2 bolsas papa + 2 bolsas zanahoria | 4 bolsas | 10 kg |
| Calabaza | 2 bolsas papa + 2 bolsas calabaza | 4 bolsas | 10 kg |
| Calabacín | 3 bolsas papa + 2 bolsas calabacín | 5 bolsas | 12.5 kg |

#### Molido (caldo espesado) — 20 barquetas × 3kg = 60kg/día

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
| Proteína (varía día) | Pollo: 8.6 kg bruto / Cerdo: 7.3 kg bruto |

#### Puré de papas — 22 barquetas × 3kg = 66kg/día

| Ingrediente | Cantidad |
|-------------|----------|
| Papas congeladas (2.5 kg/bolsa) | **32 bolsas** (80 kg bruto) |
| Merma 15% | −12 kg |
| Papa cocida disponible | ~68 kg |
| Agua de cocción | usar la propia |
| Sal + aceite | al gusto (~300-400ml aceite) |

#### Resumen bolsas diarias (dietas blandas)
- Papas: **39 bolsas** (7 chinos + 32 puré)
- Zanahoria: 3 bolsas
- Calabaza: 2 bolsas
- Calabacín: 4 bolsas
- **Total bolsas congeladas/día: 48 bolsas**

---

## 2. Usuarios del Sistema

### 2.1 Tipos de Usuario
- **Chef / Cocinero**: Calcula producción diaria, registra elaboraciones
- **Supervisor / Jefe de cocina**: Ve dashboard de todos los chefs, puede gestionar configuración

### 2.2 Autenticación
- Login con **usuario corto + PIN numérico de 4 dígitos**
- Sin emails largos, optimizado para cocina (manos mojadas, guantes)
- Gestionado con **Supabase Auth**

### 2.3 Multi-usuario
- 2-5 chefs simultáneos
- Cada registro lleva `user_id` del chef que lo hizo
- Dashboard puede filtrar por chef

---

## 3. Funcionalidades del Sistema

### 3.1 Pantalla: Calcular Producción

**Flujo principal:**
1. Chef selecciona servicio: ☀️ Almuerzo o 🌙 Cena
2. Sistema carga automáticamente pacientes por centro (editables)
3. Chef añade platos del servicio (uno o varios)
4. Para cada plato: selecciona/escribe proteína + guarnición(es)
5. Sistema calcula y muestra resultados detallados

**Para cada plato, el resultado muestra:**
- **Proteína**: cajas a abrir, unidades disponibles, unidades necesarias, sobrante, desglose por centro
- **Guarnición 1**: bolsas a abrir, kg bruto, kg neto listo, sobrante
- **Guarnición 2** (opcional): ídem
- **Bandeja**: gramos por paciente (proteína + guarnición)

**Selección rápida de proteínas** (chips/botones):
- Muslo pollo, Contramuslo, Pescado, Albóndigas, Hamburguesa, Quiché

**Selección rápida de guarniciones** (chips/botones):
- Arroz, Macarrones, Habichuelas, Coliflor, Brócoli, Menestra, Zanahoria, Col Bruselas, Papas dólar, Puré de papa

**Mermas automáticas**: al escribir o seleccionar un ingrediente, el sistema autocompleta el % de merma con etiqueta "auto". Si el chef lo edita manualmente, muestra "manual".

### 3.2 Pantalla: Dietas Blandas

Pantalla de **consulta estática** (no requiere input). Muestra siempre:
- Tabla de chinos (3 tipos) con bolsas exactas
- Tabla de molido con ingredientes y proteína variable
- Tabla de puré con 32 bolsas de papas
- Resumen total: 48 bolsas congeladas al día

### 3.3 Pantalla: Registrar Producción

Chef guarda cada elaboración del día:
- Nombre del plato
- Raciones totales
- Servicio (almuerzo/cena)
- Fecha y hora automáticas
- Chef autenticado (automático)
- Vista del "parte de hoy"

### 3.4 Pantalla: Dashboard

Métricas del mes actual:
- Total raciones del mes
- Total elaboraciones
- Días con registro
- Media raciones/día
- Gráfico de barras: platos más elaborados
- Historial reciente con filtro por chef
- Comparativa almuerzo vs cena

---

## 4. Stack Tecnológico

### 4.1 Frontend
```
React 18 + TypeScript
Vite (bundler + dev server)
Tailwind CSS (estilos)
vite-plugin-pwa (manifest + service worker = instalable en móvil)
React Router v6 (navegación)
Zustand (estado global)
```

### 4.2 Backend / Base de datos
```
Supabase (PostgreSQL en la nube)
Supabase Auth (autenticación usuario+PIN)
Supabase Realtime (dashboard en vivo)
```

### 4.3 Deploy
```
Vercel (hosting gratuito)
Dominio: cocinerhosp.vercel.app
```

### 4.4 PWA
```
manifest.json: nombre, íconos, theme_color, display: standalone
Service Worker: cache offline, instalable desde Safari/Chrome
```

---

## 5. Esquema de Base de Datos (Supabase)

```sql
-- Usuarios/chefs
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,        -- nombre corto: "carlos"
  nombre_completo TEXT,
  rol TEXT DEFAULT 'chef',              -- 'chef' | 'supervisor'
  centro_id TEXT,                       -- centro asignado (opcional)
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Registros de producción diaria
CREATE TABLE registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  plato TEXT NOT NULL,
  servicio TEXT NOT NULL,               -- 'almuerzo' | 'cena' | 'desayuno' | 'merienda'
  raciones INTEGER NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuración de centros (editable)
CREATE TABLE centros (
  id TEXT PRIMARY KEY,                  -- 'sur', 'candelaria', etc.
  nombre TEXT NOT NULL,
  pax_almuerzo INTEGER NOT NULL,
  pax_cena INTEGER NOT NULL,
  color TEXT,                           -- color hex para UI
  activo BOOLEAN DEFAULT true
);

-- Insertar centros iniciales
INSERT INTO centros VALUES
  ('sur', 'Sur', 120, 120, '#1B5E3F', true),
  ('candelaria', 'Candelaria', 120, 30, '#1E3A5F', true),
  ('parque', 'Parque', 50, 50, '#6B3FA0', true),
  ('centro', 'Centro', 100, 100, '#8B4513', true),
  ('hogara', 'Hogar A', 12, 12, '#991B1B', true),
  ('hogarb', 'Hogar B', 12, 12, '#B45309', true);
```

---

## 6. Paleta de Colores (Design Tokens)

```typescript
// src/theme/colors.ts
export const colors = {
  bg:           '#F4F3EF',   // fondo general (arena cálida)
  surface:      '#FFFFFF',   // tarjetas y superficies
  surface2:     '#EEEDE8',   // superficies secundarias
  border:       '#D9D7CF',   // bordes sutiles
  text:         '#1A1917',   // texto principal
  text2:        '#6B6860',   // texto secundario
  text3:        '#9E9C95',   // texto terciario / placeholders

  // Almuerzo (verde bosque)
  accent:       '#1B5E3F',
  accentLight:  '#E8F3ED',

  // Cena (azul marino)
  accent2:      '#1E3A5F',
  accent2Light: '#EFF6FF',

  // Advertencias / sobrantes
  warn:         '#B45309',
  warnLight:    '#FEF3C7',

  // Errores / insuficiente
  red:          '#991B1B',
  redLight:     '#FEE2E2',

  // Tipografía
  fontSans:     "'DM Sans', sans-serif",
  fontMono:     "'DM Mono', monospace",
}
```

---

## 7. Estructura de Archivos del Proyecto

```
cocinerhosp/
├── public/
│   ├── manifest.json              ← PWA: nombre, íconos, colores
│   ├── sw.js                      ← Service worker (generado por vite-pwa)
│   └── icons/                     ← Íconos 192x192 y 512x512
├── src/
│   ├── main.tsx                   ← Entry point React
│   ├── App.tsx                    ← Router + Auth guard
│   │
│   ├── pages/
│   │   ├── Login.tsx              ← Login username + PIN
│   │   ├── Calcular.tsx           ← Calculadora de producción (pantalla principal)
│   │   ├── Blandas.tsx            ← Dietas blandas (consulta estática)
│   │   ├── Registrar.tsx          ← Registrar elaboración + parte del día
│   │   └── Dashboard.tsx          ← Métricas mensuales
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx      ← Navegación inferior (4 tabs)
│   │   │   └── TopBar.tsx         ← Barra superior con fecha y usuario
│   │   ├── calcular/
│   │   │   ├── ServicioToggle.tsx ← Almuerzo / Cena toggle
│   │   │   ├── CentrosGrid.tsx    ← Grid de 6 centros con inputs editables
│   │   │   ├── PlatoItem.tsx      ← Un plato: proteína + guarnición(es)
│   │   │   ├── ProteinaSection.tsx ← Config proteína (caja, ración, unidad, merma)
│   │   │   ├── GuarnicionSection.tsx ← Config guarnición (bolsa, merma, g/ración)
│   │   │   └── ResultadoPlato.tsx ← Resultado del cálculo para un plato
│   │   ├── blandas/
│   │   │   ├── TablaChinos.tsx
│   │   │   ├── TablaMolido.tsx
│   │   │   └── TablaPure.tsx
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Badge.tsx
│   │
│   ├── data/
│   │   ├── mermas.ts              ← Tabla completa de mermas (ver sección 1.5)
│   │   ├── centros.ts             ← 6 centros con pax almuerzo/cena y colores
│   │   ├── proteinaPresets.ts     ← 6 proteínas con caja/ración/unidad
│   │   ├── guarnicionPresets.ts   ← 10 guarniciones con bolsa/merma defaults
│   │   └── blandas.ts             ← Producción fija dietas blandas
│   │
│   ├── hooks/
│   │   ├── useCalculo.ts          ← Lógica de cálculo proteína + guarnición
│   │   ├── useHistorial.ts        ← CRUD registros en Supabase
│   │   ├── useCentros.ts          ← Cargar/actualizar centros desde Supabase
│   │   └── useAuth.ts             ← Autenticación con Supabase Auth
│   │
│   ├── lib/
│   │   ├── supabase.ts            ← Cliente Supabase
│   │   └── calculos.ts            ← Funciones puras de cálculo (sin React)
│   │
│   ├── store/
│   │   └── useAppStore.ts         ← Zustand: servicio, platos, resultados
│   │
│   └── theme/
│       └── colors.ts              ← Design tokens (ver sección 6)
│
├── .env.local                     ← VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── index.html
├── vite.config.ts                 ← Con vite-plugin-pwa configurado
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. Lógica de Cálculo (Funciones Puras)

```typescript
// src/lib/calculos.ts

// ── PROTEÍNA ──
export function calcularProteina(params: {
  totalPacientes: number
  unidadesPorCaja: number
  unidadesPorRacion: number
  mermaP: number           // % merma (ej: 30 para 30%)
}): ProteinaResult {
  const { totalPacientes, unidadesPorCaja, unidadesPorRacion, mermaP } = params
  const unidadesNecesarias = unidadesPorRacion * totalPacientes
  const cajasAbrir = Math.ceil(unidadesNecesarias / unidadesPorCaja)
  const unidadesDisponibles = cajasAbrir * unidadesPorCaja
  const sobrante = unidadesDisponibles - unidadesNecesarias
  const sobranteRaciones = Math.floor(sobrante / unidadesPorRacion)

  return { unidadesNecesarias, cajasAbrir, unidadesDisponibles, sobrante, sobranteRaciones }
}

// ── BANDEJAS DE HORNO ──
export function calcularBandejasHorno(params: {
  unidadesNecesarias: number
  capacidadBandeja: number   // default: 25 para muslo de pollo
}): number {
  return Math.ceil(params.unidadesNecesarias / params.capacidadBandeja)
}

// ── GUARNICIÓN (bolsa congelada con merma) ──
export function calcularGuarnicion(params: {
  totalPacientes: number
  bolsaKg: number         // 2.5
  mermaP: number          // % merma (puede ser negativo para absorción)
  racionG: number         // 120 o 60 si hay 2 guarniciones
}): GuarnicionResult {
  const { totalPacientes, bolsaKg, mermaP, racionG } = params
  const bolsaG = bolsaKg * 1000
  const merma = mermaP / 100
  const netoNecesario = racionG * totalPacientes

  let brutoNecesario: number
  let netoReal: number
  let bolsas: number

  if (merma < 0) {
    // Absorción (arroz, pasta)
    const factor = 1 + Math.abs(merma)
    brutoNecesario = netoNecesario / factor
    bolsas = Math.ceil(brutoNecesario / bolsaG)
    netoReal = bolsas * bolsaG * factor
    brutoNecesario = bolsas * bolsaG
  } else {
    brutoNecesario = netoNecesario / (1 - merma)
    bolsas = Math.ceil(brutoNecesario / bolsaG)
    const brutoReal = bolsas * bolsaG
    netoReal = brutoReal * (1 - merma)
    brutoNecesario = brutoReal
  }

  const sobrante = netoReal - netoNecesario

  return { netoNecesario, brutoNecesario, netoReal, bolsas, sobrante, mermaP }
}

// ── DESGLOSE POR CENTRO ──
export function calcularDesgloseCentros(params: {
  centros: Centro[]
  servicio: 'almuerzo' | 'cena'
  unidadesPorRacion: number
}): DesgloseCentro[] {
  return params.centros.map(c => ({
    nombre: c.nombre,
    color: c.color,
    pax: servicio === 'almuerzo' ? c.pax_almuerzo : c.pax_cena,
    unidades: params.unidadesPorRacion * (servicio === 'almuerzo' ? c.pax_almuerzo : c.pax_cena)
  }))
}
```

---

## 9. Configuración PWA

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CocinerHosp',
        short_name: 'CocinerHosp',
        description: 'Gestión de producción para comedor hospitalario',
        theme_color: '#1B5E3F',
        background_color: '#F4F3EF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache' }
          }
        ]
      }
    })
  ]
})
```

---

## 10. Variables de Entorno

```bash
# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## 11. Orden de Desarrollo (Fases)

### Fase 1 — Scaffolding y Auth
1. Crear proyecto con Vite + React + TypeScript
2. Instalar y configurar Tailwind CSS con los design tokens del PRD
3. Conectar Supabase (cliente + tablas)
4. Implementar Login (username + PIN)
5. BottomNav con 4 tabs + TopBar

### Fase 2 — Calculadora (pantalla principal)
1. ServicioToggle (Almuerzo/Cena)
2. CentrosGrid con carga desde Supabase + fallback local
3. PlatoItem con ProteinaSection y GuarnicionSection
4. Mermas automáticas al escribir nombre
5. calculos.ts con funciones puras y tests
6. ResultadoPlato con desglose por centro

### Fase 3 — Dietas Blandas
1. Pantalla estática con las 3 tablas
2. Resumen de 48 bolsas/día

### Fase 4 — Registrar + Historial
1. Formulario de registro (plato, raciones, servicio)
2. Guardar en Supabase con usuario autenticado
3. Parte de hoy (registros del día actual)

### Fase 5 — Dashboard
1. Consulta de registros del mes desde Supabase
2. Métricas: total raciones, elaboraciones, días, media
3. Gráfico de barras de platos más elaborados
4. Filtro por chef

### Fase 6 — PWA
1. Configurar vite-plugin-pwa
2. Manifest.json + íconos
3. Cache offline con Workbox
4. Probar instalación en iOS Safari y Android Chrome

---

## 12. Criterios de Éxito

- [ ] Chef puede calcular producción completa en menos de 30 segundos
- [ ] Mermas se autocompletam correctamente para todos los ingredientes de la lista
- [ ] La app se instala desde Safari (iOS) y Chrome (Android) como app nativa
- [ ] Funciona sin conexión a internet (datos en cache)
- [ ] Historial se guarda correctamente por chef en Supabase
- [ ] Dashboard muestra métricas reales del mes
- [ ] Tabla de blandas es siempre accesible con un tap

---

## Apéndice A: Prototipo HTML de Referencia

Ver archivo `PROTOTYPE.html` en la raíz del proyecto.
Este archivo contiene el prototipo funcional completo con:
- Toda la lógica de cálculo implementada en JavaScript
- El diseño visual final (paleta, tipografía, layout)
- Los 4 tabs funcionando (Calcular, Blandas, Registrar, Dashboard)
- Mermas automáticas por nombre de ingrediente
- Toggle Almuerzo/Cena con carga automática de centros
- Segunda guarnición opcional (60g c/u al activar)

El agente DEBE usar este HTML como referencia definitiva de UI/UX y lógica de negocio al implementar los componentes React.
