# PROMPT INICIAL — CocinerHosp para OpenCode / Claude Code

> Copia y pega este prompt completo al abrir tu agente en OpenCode.
> Es el arranque maestro del proyecto.

---

## PROMPT DE ARRANQUE

```
Vamos a construir CocinerHosp, una PWA mobile-first para gestión de producción de un comedor hospitalario en Tenerife, España.

Antes de escribir cualquier línea de código, lee OBLIGATORIAMENTE estos dos archivos en este orden:
1. PRD.md — contiene toda la lógica de negocio, fórmulas de cálculo, paleta de colores y estructura de archivos
2. AGENTS.md — contiene las reglas de código y estándares que debes seguir

Una vez leídos, ejecuta la Fase 1 del PRD (sección 11 — Orden de Desarrollo):

FASE 1 — Scaffolding y Auth:
1. Crea el proyecto con: npm create vite@latest cocinerhosp -- --template react-ts
2. Instala dependencias:
   - npm install -D tailwindcss postcss autoprefixer
   - npm install @supabase/supabase-js
   - npm install zustand
   - npm install react-router-dom
   - npm install vite-plugin-pwa
   - npm install -D vitest @testing-library/react @testing-library/jest-dom
3. Configura Tailwind con los design tokens del PRD (sección 6 — colores exactos)
4. Crea src/theme/colors.ts con los tokens del PRD
5. Crea src/lib/supabase.ts con el cliente (usar variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
6. Crea el esquema SQL de Supabase (sección 5 del PRD) — generar el archivo supabase/schema.sql
7. Implementa la pantalla Login.tsx (username corto + PIN de 4 dígitos)
8. Crea BottomNav.tsx con 4 tabs: Calcular 🧮, Blandas 🥣, Registrar 📋, Dashboard 📊
9. Crea TopBar.tsx con fecha actual y nombre del usuario logueado
10. Crea App.tsx con React Router v6 + Auth guard (redirige a /login si no hay sesión)

Al terminar cada paso, confirma que compila sin errores TypeScript.

IMPORTANTE: El archivo PROTOTYPE.html en la raíz es la referencia visual definitiva. Úsalo para replicar exactamente el diseño cuando implementes los componentes.
```

---

## PROMPTS POR FASE

Usa estos prompts uno por uno, en orden, después del arranque:

### Fase 2 — Calculadora
```
Ejecuta la Fase 2 del PRD. Implementa la pantalla Calcular.tsx siguiendo este orden:

1. Crea src/lib/calculos.ts con las funciones puras del PRD (sección 8):
   - calcularProteina()
   - calcularBandejasHorno()
   - calcularGuarnicion()
   - calcularDesgloseCentros()

2. Crea src/lib/calculos.test.ts con los 5 casos de test obligatorios del AGENTS.md (sección 9). 
   Ejecuta los tests con vitest antes de continuar.

3. Crea src/data/mermas.ts con la tabla completa del PRD (sección 1.5) — 
   incluye función getMerma(texto, tipo) que busca por palabras clave.

4. Crea src/data/centros.ts con los 6 centros (almuerzo Y cena) y sus colores.

5. Crea src/data/proteinaPresets.ts con los 6 presets del PRD (sección 1.3).

6. Crea src/data/guarnicionPresets.ts con los 10 presets + mermas automáticas.

7. Crea src/store/useAppStore.ts con Zustand:
   - servicio: 'almuerzo' | 'cena'
   - centros: Centro[] (con pax editables)
   - platos: Plato[]
   - acciones: setServicio, updateCentro, addPlato, removePlato, updatePlato

8. Implementa los componentes en orden:
   - ServicioToggle.tsx (verde almuerzo / azul cena)
   - CentrosGrid.tsx (6 centros, inputs numéricos, total automático)
   - ProteinaSection.tsx (quick-select chips + campos editables + merma auto)
   - GuarnicionSection.tsx (igual, con botón "+ segunda guarnición")
   - PlatoItem.tsx (agrupa proteína + guarnición(es))
   - ResultadoPlato.tsx (resultado con desglose por centro)

9. Ensambla Calcular.tsx con todos los componentes.

Referencia visual: PROTOTYPE.html — función calcular() y los componentes de resultado.
```

### Fase 3 — Dietas Blandas
```
Ejecuta la Fase 3 del PRD. Implementa la pantalla Blandas.tsx:

1. Crea src/data/blandas.ts con los datos fijos del PRD (sección 1.6):
   - CHINOS: 3 tipos con sus bolsas exactas
   - MOLIDO: ingredientes con cantidades
   - PURE: 32 bolsas papa + resto ingredientes
   - RESUMEN: 48 bolsas totales/día

2. Implementa los 3 componentes:
   - TablaChinos.tsx: 3 tarjetas color-coded (naranja zanahoria, amarillo calabaza, verde calabacín)
   - TablaMolido.tsx: lista ingredientes + tabla proteína variable (pollo/cerdo)
   - TablaPure.tsx: 32 bolsas destacadas, merma, sal+aceite

3. Ensambla Blandas.tsx con el resumen de 48 bolsas al final (banner verde).

Referencia visual: PROTOTYPE.html — sección screen-blandas.
```

### Fase 4 — Registrar + Historial
```
Ejecuta la Fase 4 del PRD. Implementa la pantalla Registrar.tsx:

1. Crea src/hooks/useHistorial.ts con:
   - getRegistrosHoy(): registros del día del chef logueado
   - getRegistrosMes(): registros del mes actual
   - addRegistro(plato, raciones, servicio): inserta en Supabase con usuario_id
   - Manejo de errores con try/catch

2. Implementa Registrar.tsx:
   - Formulario: nombre del plato (text), raciones (number), servicio (select)
   - Botón guardar → llama addRegistro → actualiza lista
   - "Parte de hoy": lista de registros del día con hora, plato, raciones y servicio

Referencia visual: PROTOTYPE.html — sección screen-registrar.
```

### Fase 5 — Dashboard
```
Ejecuta la Fase 5 del PRD. Implementa la pantalla Dashboard.tsx:

1. Crea src/hooks/useDashboard.ts con:
   - getMetricasMes(): total raciones, elaboraciones, días únicos, media/día
   - getPlatosMasElaborados(): top 6 platos del mes con conteo
   - getHistorialReciente(): últimos 8 registros

2. Implementa Dashboard.tsx:
   - Grid 2×2 de métricas (raciones, elaboraciones, días, media)
   - Gráfico de barras horizontal simple con Tailwind (no recharts, hacerlo con divs)
   - Historial reciente con badge de servicio (verde almuerzo, azul cena)

Referencia visual: PROTOTYPE.html — función renderDashboard().
```

### Fase 6 — PWA
```
Ejecuta la Fase 6 del PRD. Configura la PWA:

1. Actualiza vite.config.ts con vite-plugin-pwa según el PRD (sección 9):
   - nombre: CocinerHosp
   - theme_color: #1B5E3F
   - display: standalone
   - orientación: portrait
   - Workbox con NetworkFirst para Supabase

2. Crea public/manifest.json

3. Genera íconos en public/icons/:
   - icon-192.png (192×192, fondo #1B5E3F, letra blanca CH)
   - icon-512.png (512×512, mismo diseño)
   (Si no puedes generar PNGs, crea un SVG y documenta cómo convertirlo)

4. Verifica que la app pasa el Lighthouse PWA audit:
   - Instalable
   - Funciona offline
   - Tiene manifest válido

5. Documenta en README.md cómo desplegar en Vercel.
```

---

## PROMPT DE VERIFICACIÓN FINAL

```
Antes de declarar el proyecto completo, verifica:

1. Ejecuta: npx tsc --noEmit
   → Debe dar 0 errores

2. Ejecuta: npx vitest run
   → Todos los tests de calculos.test.ts deben pasar

3. Verifica manualmente estos casos de negocio:
   a) Almuerzo, Albóndigas (5/ración, 52/caja), 414 pacientes:
      → Debe dar: 40 cajas, 2080 disponibles, 2070 necesarias, 10 sobrante (2 raciones extra)
   
   b) Cena, Muslo de pollo (2/ración, 20/caja), 324 pacientes:
      → Debe dar: 33 cajas, 660 disponibles, 648 necesarias, 12 sobrante (6 raciones extra)
      → Bandejas horno (25/bandeja): 26 bandejas
   
   c) Guarnición Habichuelas (22% merma, 2.5kg/bolsa), 414 pacientes, 120g/ración:
      → neto necesario: 49,680g
      → bruto necesario: 63,692g
      → bolsas: 26 bolsas (65,000g bruto)
      → neto real: 50,700g
      → sobrante: +1,020g (8 raciones extra)
   
   d) Guarnición Arroz (merma -200%, absorción ×3), 50 pacientes, 120g/ración:
      → neto necesario: 6,000g
      → bruto seco: 2,000g → 1 bolsa (2,500g)
      → neto real cocido: 7,500g
      → sobrante: +1,500g (12 raciones extra)

4. Prueba en móvil:
   → npm run build && npm run preview
   → Abre en Chrome/Safari del teléfono
   → Verifica que se puede instalar como PWA

Si algún cálculo falla, corrige calculos.ts antes de continuar.
```

---

## NOTAS PARA EL AGENTE

- El archivo `PROTOTYPE.html` en la raíz del proyecto es tu biblia de diseño y lógica. Léelo completo.
- Cuando tengas dudas sobre un cálculo, el PRD tiene la fórmula exacta.
- Los centros con sus pacientes exactos están en el PRD — no inventar valores.
- La merma de muslo de pollo es 30% (horno). El muslo tiene 2 unidades por ración.
- Las bolsas de congelados son siempre 2.5kg (NO 3kg).
- Barquetas de dietas blandas son 3kg cada una.
- El puré necesita 32 bolsas de papa de 2.5kg — ese número es fijo y verificado.
