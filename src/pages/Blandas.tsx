import { IconSoup } from '@tabler/icons-react'
import TablaChinos from '../components/blandas/TablaChinos'
import TablaPure from '../components/blandas/TablaPure'
import CalculadoraPapas from '../components/blandas/CalculadoraPapas'

export default function Blandas() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-2">
        <IconSoup size={17} className="text-accent" />
        Dietas Blandas
      </div>
      <p className="text-xs text-text2 mb-[10px]">
        Calculá las cantidades según las barquetas que necesites preparar
      </p>

      {/* Cards */}
      <TablaChinos />
      <TablaPure />

      {/* Separador */}
      <div className="border-t border-border my-[14px]" />

      {/* Calculadora de pedido semanal */}
      <CalculadoraPapas />
    </>
  )
}
