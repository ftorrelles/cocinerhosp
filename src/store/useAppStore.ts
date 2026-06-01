import { create } from 'zustand'
import { getPacientesPorServicio, CENTROS } from '../data/centros'
import {
  calcularProteina,
  calcularGuarnicion,
  calcularDesgloseCentros,
  type ProteinaResult,
  type GuarnicionResult,
  type DesgloseCentro,
} from '../lib/calculos'

// ── Types ──

export interface Plato {
  id: string
  nombre: string

  // Proteína
  unidadesPorCaja: number
  unidadesPorRacion: number
  nombreUnidad: string
  mermaProteina: number
  mermaProtAuto: boolean
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

export interface ResultadoPlato {
  id: string
  nombre: string
  servicio: string
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
  mermaProtP: number
}

export interface UserSession {
  id: string
  username: string
  nombre_completo: string
  rol: string
}

export interface AppState {
  servicio: 'almuerzo' | 'cena'
  pacientes: Record<string, number>
  platos: Plato[]
  resultados: ResultadoPlato[] | null
  user: UserSession | null

  setServicio: (s: 'almuerzo' | 'cena') => void
  setPaciente: (centroId: string, valor: number) => void
  addPlato: (preset?: Partial<Plato>) => void
  removePlato: (id: string) => void
  updatePlato: (id: string, changes: Partial<Plato>) => void
  toggleGuar2: (id: string) => void
  calcular: () => void
  resetResultados: () => void
  getTotalPacientes: () => number
  setUser: (user: UserSession | null) => void
}

// ── Helpers ──

function createDefaultPlato(): Plato {
  return {
    id: crypto.randomUUID(),
    nombre: '',
    unidadesPorCaja: 52,
    unidadesPorRacion: 1,
    nombreUnidad: 'piezas',
    mermaProteina: 25,
    mermaProtAuto: false,
    mermaProtSource: 'Escribí el nombre para autocompletar',
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
  }
}

function createEjemploPlato(): Plato {
  const p = createDefaultPlato()
  return {
    ...p,
      id: crypto.randomUUID(),
    nombre: 'Muslo de pollo',
    unidadesPorCaja: 20,
    unidadesPorRacion: 2,
    nombreUnidad: 'muslos',
    mermaProteina: 30,
    mermaProtAuto: true,
    mermaProtSource: 'Muslo/pernil horno ~30% (tabla mermas hospitalaria)',
    guar1Nombre: 'Arroz',
    guar1BolsaKg: 2.5,
    guar1Merma: -200,
    guar1MermaAuto: true,
    guar1MermaSource: 'Arroz: absorbe agua, triplica peso (factor ×3)',
    guar1Gramos: 120,
    guar2Activa: true,
    guar2Nombre: 'Habichuelas',
    guar2BolsaKg: 2.5,
    guar2Merma: 22,
    guar2MermaAuto: true,
    guar2MermaSource: 'Judías/habichuelas congeladas ~22% (KitchenNmbrs)',
    guar2Gramos: 60,
  }
}

// ── Store ──

export const useAppStore = create<AppState>((set, get) => ({
  servicio: 'almuerzo',
  pacientes: getPacientesPorServicio('almuerzo'),
  platos: [createEjemploPlato()],
  resultados: null,
  user: null,

  setServicio: (servicio) => {
    set({
      servicio,
      pacientes: getPacientesPorServicio(servicio),
    })
  },

  setPaciente: (centroId, valor) => {
    set((state) => ({
      pacientes: {
        ...state.pacientes,
        [centroId]: Math.max(0, valor),
      },
    }))
  },

  addPlato: (preset) => {
    set((state) => {
      const nuevo = createDefaultPlato()
      if (preset) {
        Object.assign(nuevo, preset)
      }
      return { platos: [...state.platos, nuevo] }
    })
  },

  removePlato: (id) => {
    set((state) => ({
      platos: state.platos.filter((p) => p.id !== id),
    }))
  },

  updatePlato: (id, changes) => {
    set((state) => ({
      platos: state.platos.map((p) =>
        p.id === id ? { ...p, ...changes } : p
      ),
    }))
  },

  toggleGuar2: (id) => {
    set((state) => ({
      platos: state.platos.map((p) => {
        if (p.id !== id) return p
        const activa = !p.guar2Activa
        return {
          ...p,
          guar2Activa: activa,
          // When activating 2nd garnish, first goes to 60g; when deactivating, back to 120g
          guar1Gramos: activa ? 60 : 120,
        }
      }),
    }))
  },

  calcular: () => {
    const state = get()
    const totalPacientes = Object.values(state.pacientes).reduce(
      (a, b) => a + b,
      0
    )

    if (totalPacientes === 0 || state.platos.length === 0) {
      set({ resultados: [] })
      return
    }

    const resultados: ResultadoPlato[] = state.platos.map((plato) => {
      const proteina = calcularProteina({
        totalPacientes,
        unidadesPorCaja: plato.unidadesPorCaja,
        unidadesPorRacion: plato.unidadesPorRacion,
        mermaP: plato.mermaProteina,
      })

      const guar1 = calcularGuarnicion({
        totalPacientes,
        bolsaKg: plato.guar1BolsaKg,
        mermaP: plato.guar1Merma,
        racionG: plato.guar1Gramos,
      })

      const guar2 = plato.guar2Activa
        ? calcularGuarnicion({
            totalPacientes,
            bolsaKg: plato.guar2BolsaKg,
            mermaP: plato.guar2Merma,
            racionG: plato.guar2Gramos,
          })
        : null

      const desglose = calcularDesgloseCentros({
        centros: CENTROS,
        servicio: state.servicio,
        unidadesPorRacion: plato.unidadesPorRacion,
      })

      return {
        id: plato.id,
        nombre: plato.nombre || 'Plato',
        servicio: state.servicio === 'almuerzo' ? 'Almuerzo' : 'Cena',
        proteina,
        unidadesPorRacion: plato.unidadesPorRacion,
        nombreUnidad: plato.nombreUnidad,
        guar1,
        guar1Nombre: plato.guar1Nombre || 'Guarnición',
        guar1Gramos: plato.guar1Gramos,
        guar2,
        guar2Nombre: plato.guar2Activa ? plato.guar2Nombre || 'Guarnición 2' : null,
        guar2Gramos: plato.guar2Activa ? plato.guar2Gramos : null,
        desglose,
        mermaProtP: plato.mermaProteina,
      }
    })

    set({ resultados })
  },

  resetResultados: () => {
    set({ resultados: null })
  },

  setUser: (user) => {
    set({ user })
  },

  getTotalPacientes: () => {
    return Object.values(get().pacientes).reduce((a, b) => a + b, 0)
  },
}))
