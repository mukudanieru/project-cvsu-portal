import { cn } from '#/lib/utils.ts'
import { LoaderCircle } from 'lucide-react'
// import { IconLoader } from '@tabler/icons-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
