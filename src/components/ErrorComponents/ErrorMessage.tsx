import { AlertCircleIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export type AlertDestructiveProps = {
  title: string
  description: string
}

const AlertDestructive = ({ title, description }: AlertDestructiveProps) => {
  return (
    <Alert variant="destructive" className="max-w-md border-destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export default AlertDestructive
