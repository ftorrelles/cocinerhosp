# Spec: reparto-guarniciones

## 1. Reparto automático de pacientes

### 1.1 Función calcularReparto
- Input: `totalPacientes: number`, `cantidad: number`
- Output: `number[]` — pacientes asignados a cada guarnición
- Reglas:
  - Si `cantidad <= 1`: retorna `[totalPacientes]`
  - Si `cantidad > 1`: `base = Math.floor(totalPacientes / cantidad)`, `resto = totalPacientes % cantidad`
  - Primer elemento: `base + resto`
  - Resto de elementos: `base`
  - Siempre retorna exactamente `cantidad` elementos

### 1.2 Disparadores de recálculo
- Al **añadir** una guarnición: se recalcula el reparto para todas
- Al **quitar** una guarnición: se recalcula el reparto para las restantes
- Al **cambiar servicio** (almuerzo/cena): se recalcula el reparto (porque cambian los pacientes)
- Recálculo: para cada guarnición en orden, asignar `pacientesAsignados` del array resultado

### 1.3 Ejemplos
| Pacientes | Guarniciones | Reparto |
|-----------|-------------|---------|
| 414 | 1 | [414] |
| 414 | 2 | [207, 207] |
| 414 | 3 | [138, 138, 138] |
| 415 | 3 | [139, 138, 138] |
| 100 | 2 | [50, 50] |
| 101 | 2 | [51, 50] |

## 2. Límite máximo de guarniciones

### 2.1 Store
- `addGuarnicion` no debe agregar si ya hay 3 guarniciones activas
- No hay error — simplemente no hace nada (el UI controla la visibilidad)

### 2.2 UI (Calcular.tsx)
- Botón "Añadir otra guarnición" se **oculta** cuando `guarniciones.length >= 3`
- No se muestra mensaje de error — simplemente desaparece

## 3. UI — Pacientes asignados por guarnición

### 3.1 Header de GuarnicionSection
- Reemplazar el header actual por uno que muestre:
  - Nombre de la guarnición (editable, como ahora)
  - Badge/pill con: `{pacientesAsignados} pacientes ({porcentaje}%)`
  - Porcentaje calculado: `Math.round(pacientesAsignados / totalPacientes * 100)`
- Estilo: badge pequeño, DM Mono en el número, texto secundario
- Colores: accent (verde/azul según servicio) o text2

### 3.2 Resultado
- Las filas de resultado usan `pacientesAsignados` para calcular necesarios
- El cálculo de "Bolsas a abrir", "Peso bruto", etc. reflejan la porción asignada

## 4. Cálculo — Store

### 4.1 PreparacionGuarnicion
- Nuevo campo: `pacientesAsignados: number`

### 4.2 calcularGuarnicionPrep
- Usar `prep.pacientesAsignados` en vez de `totalPacientes` al llamar `calcularGuarnicion`
- Parámetro `totalPacientes` de `calcularGuarnicion` se usa como antes, pero ahora representa los pacientes asignados a ESA guarnición

## 5. Cálculo — Función pura

### 5.1 calcularGuarnicion
- La función en sí NO cambia — ya recibe `totalPacientes` y funciona correctamente
- El cambio está en QUIÉN la llama y con qué valor

## 6. Tests

### 6.1 Tests nuevos para calcularReparto
- `calcularReparto(414, 1)` → `[414]`
- `calcularReparto(414, 2)` → `[207, 207]`
- `calcularReparto(414, 3)` → `[138, 138, 138]`
- `calcularReparto(415, 3)` → `[139, 138, 138]`
- `calcularReparto(101, 2)` → `[51, 50]`
- `calcularReparto(0, 3)` → `[0, 0, 0]`

### 6.2 Tests existentes
- No se modifican — `calcularGuarnicion` sigue tomando `totalPacientes`
- El test de "2 guarniciones (60g + 60g)" se conserva tal cual

## 7. No-goals
- No se cambia el cálculo ni la UI de proteínas
- No se agregan animaciones ni transiciones
- No se persiste el reparto en Supabase
- No se modifica el historial de preparaciones
