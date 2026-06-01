import { IconSoup } from '@tabler/icons-react'
import TablaChinos from '../components/blandas/TablaChinos'
import TablaMolido from '../components/blandas/TablaMolido'
import TablaPure from '../components/blandas/TablaPure'
import { RESUMEN_BOLSAS } from '../data/blandas'

export default function Blandas() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-2">
        <IconSoup size={17} className="text-accent" />
        Dietas Blandas
      </div>
      <p className="text-xs text-text2 mb-[10px]">
        Producción fija diaria — no depende del número de pacientes
      </p>

      {/* Resumen badge */}
      <div className="bg-accent rounded-xl p-[14px] mb-[10px] shadow-sm text-center">
        <p className="text-[11px] text-white/80 font-medium uppercase tracking-wide mb-1">
          Total bolsas congeladas / día
        </p>
        <p className="font-mono text-[28px] font-bold text-white leading-none">
          {RESUMEN_BOLSAS.total}
        </p>
      </div>

      {/* Desglose badge */}
      <div className="bg-surface border border-border rounded-xl p-[10px] mb-[10px] shadow-sm flex justify-center gap-3 text-xs">
        <span className="text-text2">
          Papas{' '}
          <span className="font-mono font-semibold text-text">{RESUMEN_BOLSAS.papas}</span>
        </span>
        <span className="text-border">|</span>
        <span className="text-text2">
          Zanahoria{' '}
          <span className="font-mono font-semibold text-text">{RESUMEN_BOLSAS.zanahoria}</span>
        </span>
        <span className="text-border">|</span>
        <span className="text-text2">
          Calabaza{' '}
          <span className="font-mono font-semibold text-text">{RESUMEN_BOLSAS.calabaza}</span>
        </span>
        <span className="text-border">|</span>
        <span className="text-text2">
          Calabacín{' '}
          <span className="font-mono font-semibold text-text">{RESUMEN_BOLSAS.calabacin}</span>
        </span>
      </div>

      {/* Cards */}
      <TablaChinos />
      <TablaMolido />
      <TablaPure />
    </>
  )
}
