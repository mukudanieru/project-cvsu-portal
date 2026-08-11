import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'

const EncodeNotEnrolled = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/15">
        <GraduationCap className="size-8" />
      </div>

      <p className="font-heading text-sm font-medium">
        You&apos;re not enrolled yet
      </p>
      <p className="text-xs/relaxed text-muted-foreground">
        Grade encoding opens once you&apos;re enrolled for the term. Head over
        to enrollment to get started.
      </p>
      <Button asChild size="sm" className="mt-1">
        <Link to="/enroll">Go to enrollment</Link>
      </Button>
    </div>
  )
}

export default EncodeNotEnrolled
