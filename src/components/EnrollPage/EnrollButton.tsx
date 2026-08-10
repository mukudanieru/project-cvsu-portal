import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { enrollStudent } from '#/server/enroll/enroll.functions'
import { Spinner } from '../ui/spinner'

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
    <Button
      size="lg"
      className="hover:cursor-pointer"
      disabled={disabled || isPending}
      onClick={handleEnroll}
    >
      {isPending ? (
        <>
          <Spinner data-icon="inline-start" />
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
