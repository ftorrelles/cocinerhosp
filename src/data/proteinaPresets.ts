export interface ProteinaPreset {
  nombre: string
  caja: number
  racion: number
  unidad: string
}

export const PROTEINA_PRESETS: ProteinaPreset[] = [
  { nombre: 'Muslo pollo', caja: 20, racion: 2, unidad: 'muslos' },
  { nombre: 'Contramuslo', caja: 20, racion: 1, unidad: 'contramuslos' },
  { nombre: 'Pescado', caja: 10, racion: 1, unidad: 'filetes' },
  { nombre: 'Albóndigas', caja: 52, racion: 5, unidad: 'albóndigas' },
  { nombre: 'Hamburguesa', caja: 52, racion: 1, unidad: 'carnes' },
  { nombre: 'Quiché', caja: 0, racion: 0, unidad: 'porciones' },
]
