## Exploration: fase-2-calculadora

### Current State

El proyecto tiene scaffolding, auth, layout (TopBar + BottomNav), routing, y PWA. Las rutas protegidas `/`, `/blandas`, `/registrar`, `/dashboard` muestran placeholders "Pantalla en construcción". El store de Zustand está creado pero vacío. Los datos estáticos (`src/data/`) están creados pero vacíos.

Existe `PROTOTYPE.html` con la implementación completa de la calculadora en JavaScript vanilla (funciones `calcular()`, `addPlato()`, `calcGuar()`, `renderGuarBloque()`). Es la fuente de verdad para la UI y lógica de negocio.

### Requirements Summary (PRD sección 3.1 + 8 + 11 — Fase 2)

1. **ServicioToggle**: Almuerzo (☀️, verde `#1B5E3F`) / Cena (🌙, azul `#1E3A5F`)
2. **CentrosGrid**: 6 centros con inputs editables, carga desde Supabase con fallback local, total pacientes
3. **PlatoItem**: nombre del plato + proteína + guarnición(es) + botón eliminar
4. **Proteína**: preset chips (Muslo pollo, Contramuslo, Pescado, Albóndigas, Hamburguesa, Quiché), configuración de caja/ración/unidad, merma automática
5. **Guarnición**: preset chips (Arroz, Macarrones, Habichuelas, etc.), configuración de bolsa/merma/g-por-ración, segunda guarnición opcional (60g)
6. **Mermas automáticas**: al escribir nombre de ingrediente, autocompleta % de merma con etiqueta "auto" (verde) vs "manual" (ámbar)
7. **Resultado**: cajas a abrir, unidades necesarias/disponibles/sobrante, bolsas, kg, desglose por centro en pills
8. **Funciones puras** en `src/lib/calculos.ts` con tests (PRD sección 8, AGENTS.md sección 9)
9. **Zustand store**: servicio actual, lista de platos, resultados

### Affected Areas

```
src/
├── pages/
│   └── Calcular.tsx              ← NUEVA (pantalla principal)
├── components/
│   └── calcular/
│       ├── ServicioToggle.tsx    ← NUEVO
│       ├── CentrosGrid.tsx       ← NUEVO
│       ├── PlatoItem.tsx         ← NUEVO
│       ├── ProteinaSection.tsx   ← NUEVO
│       ├── GuarnicionSection.tsx ← NUEVO
│       └── ResultadoPlato.tsx    ← NUEVO
├── data/
│   ├── centros.ts                ← NUEVO (6 centros con pax)
│   ├── mermas.ts                 ← NUEVO (tabla completa de mermas)
│   ├── proteinaPresets.ts        ← NUEVO (6 presets)
│   └── guarnicionPresets.ts      ← NUEVO (10 presets)
├── hooks/
│   └── useCalculo.ts             ← NUEVO (lógica de cálculo con estado)
├── lib/
│   └── calculos.ts               ← NUEVO (funciones puras)
├── store/
│   └── useAppStore.ts            ← MODIFICADO (servicio, platos, resultados)
└── App.tsx                       ← MODIFICADO (reemplazar placeholder)
```

### Approaches

1. **Funciones puras primero (recomendado)** — Implementar `calculos.ts` con tests, luego data estática, luego store, luego componentes de UI de abajo hacia arriba
   - Pros: Tests verifican la lógica antes de la UI, las funciones son puras y testables, el PROTOTYPE.html tiene la lógica ya validada
   - Cons: No se ve resultado hasta tener los componentes
   - Effort: Medio

2. **Componentes primero desde el prototipo** — Extraer componentes del HTML y conectar datos después
   - Pros: Visualización rápida
   - Cons: La lógica de cálculo queda mezclada con la UI, difícil de testear
   - Effort: Alto

3. **Store + UI en paralelo** — Store y componentes se desarrollan juntos mockeando datos
   - Pros: Desarrollo más rápido de la UI
   - Cons: Store sin las funciones puras termina con lógica duplicada
   - Effort: Medio

### Recommendation

**Approach 1: Funciones puras primero**. Orden:
1. `src/data/centros.ts`, `mermas.ts`, `proteinaPresets.ts`, `guarnicionPresets.ts`
2. `src/lib/calculos.ts` — funciones puras desde el PRD (sección 8) y PROTOTYPE.html
3. `src/lib/calculos.test.ts` — tests obligatorios (AGENTS.md sección 9)
4. `src/store/useAppStore.ts` — Zustand store con servicio, platos, resultados
5. `src/hooks/useCalculo.ts` — hook que orquesta store + cálculos
6. Componentes de UI (de los más internos a la página):
   - ServicioToggle → CentrosGrid → ProteinaSection → GuarnicionSection → PlatoItem → ResultadoPlato → Calcular.tsx
7. Reemplazar placeholder en App.tsx

### Risks

- **Mermas automáticas**: La lógica de autocompletado por nombre de ingrediente es por substring matching — hay que replicar exactamente la función `getMerma()` del PROTOTYPE.html
- **Cálculo de absorción**: Arroz (×3) y pasta (×2.5) tienen merma negativa — el PRD y el prototipo tienen la fórmula exacta, no inventar
- **Tests obligatorios**: AGENTS.md especifica 5 casos de test que DEBEN estar en `calculos.test.ts`
- **Segunda guarnición**: Cambia la ración de 120g a 60g + 60g — fácil de olvidar
- **Estado por plato**: Cada plato tiene su propia configuración de proteína y guarniciones — el store debe manejar múltiples platos

### Ready for Proposal

Yes
