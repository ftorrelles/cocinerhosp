import { IconDownload } from '@tabler/icons-react'
import { useInstallPWA } from '../../hooks/useInstallPWA'

export default function InstallPWA() {
  const { isInstallable, install } = useInstallPWA()

  if (!isInstallable) return null

  return (
    <div className="px-4 pt-[6px] pb-0">
      <button
        onClick={install}
        className="w-full flex items-center justify-center gap-2 py-[10px] text-sm font-semibold text-white border-none rounded-xl cursor-pointer active:scale-[0.98] transition-all bg-accent hover:opacity-90"
      >
        <IconDownload size={16} />
        <span>Instalar app</span>
      </button>
    </div>
  )
}
