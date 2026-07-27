import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/card'

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number | null
}) => {
  return (
    <Card className="p-4">
      <p className="flex items-center gap-2 text-xs text-accent-foreground mb-1">
        <Icon size={14} />
        {label}
      </p>
      <p className="text-xl font-medium">{value !== null ? value : '-'}</p>
    </Card>
  )
}

export default StatCard
