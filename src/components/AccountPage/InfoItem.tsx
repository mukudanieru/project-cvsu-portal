import type { LucideIcon } from 'lucide-react'

type Info = {
  label: string
  value: string
  icon: LucideIcon
}

const InfoItem = ({ label, value, icon: Icon }: Info) => {
  return (
    <div className="flex flex-col gap-1 px-4 py-1.5">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Icon size={14} />
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

export default InfoItem
