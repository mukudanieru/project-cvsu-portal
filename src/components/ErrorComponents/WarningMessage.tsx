import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { CircleAlert } from 'lucide-react'

interface ErrorInfo {
  title: string
  description: string
}

interface WarningMessageProps {
  error: ErrorInfo
}

const WarningMessage = ({ error }: WarningMessageProps) => {
  return (
    <Card className="flex w-full max-w-3xl flex-col items-center gap-6 px-8 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/15">
        <CircleAlert />
      </div>

      <div className="flex flex-col gap-2">
        <CardTitle>{error.title}</CardTitle>
        <CardDescription>{error.description}</CardDescription>
      </div>
    </Card>
  )
}

export default WarningMessage
