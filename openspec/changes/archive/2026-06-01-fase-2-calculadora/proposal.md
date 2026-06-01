## Proposal: fase-2-calculadora

### Intent

Implementar la pantalla principal de la aplicación: la calculadora de producción diaria. El chef selecciona servicio (almuerzo/cena), visualiza y edita pacientes por centro, agrega platos con proteína y guarnición(es), y el sistema calcula cajas a abrir, bolsas necesarias, sobrante y desglose por centro. Las mermas se autocompletan al escribir el nombre del ingrediente.

### Scope

**In scope:**

1. **Datos estáticos**: `centros.ts`, `mermas.ts`, `proteinaPresets.ts`, `guarnicionPresets.ts` en `src/data/`
2. **Funciones puras**: `src/lib/calculos.ts` con `calcularProteina()`, `calcularGuarnicion()`, `calcularBandejasHorno()`, `calcularDesgloseCentros()`
3. **Tests**: `src/lib/calculos.test.ts` con los 5 casos obligatorios del AGENTS.md
4. **Zustand store**: `src/store/useAppStore.ts` — servicio actual, platos, resultados
5. **Hook**: `src/hooks/useCalculo.ts` — orquesta cálculos con el store
6. **ServicioToggle** — Toggle Almuerzo (verde) / Cena (azul)
7. **CentrosGrid** — Grid de 6 centros, inputs editables, total pacientes
8. **ProteinaSection** — Chip presets + campos caja/ración/unidad + merma automática
9. **GuarnicionSection** — Chip presets + campos bolsa/merma/g-por-ración + toggle segunda guarnición
10. **PlatoItem** — Contenedor de plato con nombre + proteína + guarnición(es) + eliminar
11. **ResultadoPlato** — Desglose: cajas, unidades, bolsas, kg, sobrante, pills por centro
12. **Página Calcular** — `src/pages/Calcular.tsx` que ensambla todo
13. **App.tsx** — Reemplazar placeholder de ruta `/` con `<Calcular />`

**Out of scope:**
- Conexión con Supabase para centros (usa datos locales por now)
- Guardar cálculos en historial (Fase 4)
- Dashboard (Fase 5)

### Revision: Auth custom (agregado durante implementación)

**Motivación**: La estrategia original usaba `supabase.auth.signInWithPassword()` con email sintético (`username@cocinerhosp.internal`). Esto agrega complejidad innecesaria — emails falsos, dependencia de Supabase Auth, sin control sobre la sesión.

**Nuevo enfoque**: Login custom contra tabla `usuarios` en Supabase. El hook `useAuth` consulta la tabla directamente, verifica el PIN con bcryptjs, y maneja la sesión en localStorage como JSON plano.

**Archivos afectados**:
- `src/hooks/useAuth.ts` — Reescribir completamente
- `src/lib/supabase.ts` — Sin cambios (solo el cliente, las queries van en hooks)
- `src/pages/Login.tsx` — Sin cambios visuales (solo tipado de session)
- `src/components/layout/ProtectedLayout.tsx` — Solo tipado de session
- `package.json` — Agregar bcryptjs

### Approach

**Funciones puras primero**, de adentro hacia afuera:
1. Data → calculos.ts → tests → store → hook → componentes → página

### Key Decisions

1. **Merma automática por substring**: Replicar exactamente la función `getMerma()` del PROTOTYPE.html — busca coincidencia de substring en el nombre del ingrediente contra la tabla de mermas
2. **Prototipo como fuente de diseño**: La pantalla Calcular debe verse IDÉNTICA al PROTOTYPE.html — mismos colores, espaciados, bordes, tipografía, layout de chips, grid de centros, pills de desglose
3. **Segunda guarnición**: Al activarse, cambia la ración de 120g a 60g + 60g por plato. No es un toggle global — es por plato
4. **Store con múltiples platos**: Cada plato es un objeto independiente con su propia configuración de proteína y guarniciones
5. **Merma tag "auto"/"manual"**: Si el sistema autocompleta la merma, muestra etiqueta verde "auto". Si el chef la edita manualmente, cambia a ámbar "manual"

### Risks

- **PROTOTYPE.html omitió el componente de Login**: Para la calculadora sí está completo — replicar exactamente el HTML/CSS/JS
- **Tests obligatorios**: No se puede saltar — están en AGENTS.md sección 9
- **Merma de absorción**: Arroz (×3) y pasta (×2.5) tienen merma NEGATIVA — la fórmula es diferente

### Spec dependency

La spec debe definir:
- Comportamiento exacto del toggle almuerzo/cena (colores, recálculo de centros)
- Validación de inputs (pacientes mínimo 0, cajas mínimo 1)
- Qué pasa si no hay platos y se toca "Calcular"
- Límite de platos (si hay)
- Formato de números en resultados
- Desglose por centro: qué centros mostrar (todos o solo los con pacientes > 0)
