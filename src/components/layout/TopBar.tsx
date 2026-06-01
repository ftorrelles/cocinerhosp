import { useEffect, useState } from 'react'
import { IconBuildingHospital } from '@tabler/icons-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function TopBar() {
  const [dateStr, setDateStr] = useState(() => getFormattedDate())

  useEffect(() => {
    const tick = () => setDateStr(getFormattedDate())

    // Update on visibility change (user returns to tab on a new day)
    document.addEventListener('visibilitychange', tick)

    // Update every minute to catch day changes
    const interval = setInterval(tick, 60_000)

    return () => {
      document.removeEventListener('visibilitychange', tick)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="sticky top-0 z-100 bg-accent text-white px-4 py-[14px] flex items-center justify-between">
      <div className="flex items-center gap-2 text-base font-semibold">
        <IconBuildingHospital size={20} />
        CocinerHosp
      </div>
      <time className="text-[11px] font-mono opacity-75">{dateStr}</time>
    </header>
  )
}

function getFormattedDate(): string {
  const now = new Date()
  const dayAbbr = format(now, 'EEE', { locale: es })
  const dayNum = format(now, 'd')
  const monthAbbr = format(now, 'MMM', { locale: es })
  return `${dayAbbr} ${dayNum} ${monthAbbr}`
}
