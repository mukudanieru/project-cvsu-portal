import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { enrollStudent } from '#/server/enroll/enroll.functions'

const EnrollButton = ({ disabled }: { disabled: boolean }) => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleEnroll() {
    setIsPending(true)

    try {
      const result = await enrollStudent()

      if ('error' in result) {
        toast.error(result.error.title, {
          description: result.error.description,
        })
        return
      }

      toast.success('Enrollment successful')
      await router.invalidate()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button size="lg" disabled={disabled || isPending} onClick={handleEnroll}>
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Enrolling...
        </>
      ) : disabled ? (
        'Already Enrolled'
      ) : (
        'Enroll'
      )}
    </Button>
  )
}

export default EnrollButton
