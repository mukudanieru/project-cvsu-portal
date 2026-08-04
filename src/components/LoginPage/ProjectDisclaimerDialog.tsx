import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CircleQuestionMark, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

const features = [
  'Create your own personal account, no real student data required',
  'View your academic record and a computed general weighted average (GWA)',
  'Export your registration form as a PDF, styled after the original',
]

const DISCLAIMER_STORAGE_KEY = 'myindex:has-seen-disclaimer'

const ProjectDisclaimerDialog = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem(DISCLAIMER_STORAGE_KEY)

    if (!hasSeenDisclaimer) {
      setOpen(true)
      localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true')
    }
  }, [])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="flex max-h-[80vh] flex-col gap-0 p-0"
        asChild
      >
        <Button variant="secondary" size="icon">
          <CircleQuestionMark size={14} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex max-h-[80vh] flex-col gap-0 p-0 m-2">
        <AlertDialogHeader className="border-b px-6 py-4">
          <AlertDialogTitle className="text-lg">
            About This Project
          </AlertDialogTitle>
          <AlertDialogDescription>
            A student's take on what the CvSU portal could look like.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <p className="py-4">
            This is an independent portfolio project and is not affiliated with,
            endorsed by, or an official product of Cavite State University.
          </p>

          <p className="pb-4">
            It exists to showcase one developer's own idea of what the Virtual
            Registration Form and student portal experience could look like,
            built as a final project, not a replacement for the real system.
          </p>

          <p className="pb-3">
            Everything you see here runs on simulated data. You're free to
            create a personal account and try it out end-to-end:
          </p>

          <ul className="mb-4 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 shrink-0 text-primary" size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <p className="pb-4 text-sm text-muted-foreground">
            Looking for the actual university portal? Head over to the{' '}
            <a
              href="https://myportal.cvsu.edu.ph/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              official CvSU student portal
            </a>
            .
          </p>
        </div>
        <AlertDialogFooter className="border-t px-6 py-4">
          <AlertDialogAction variant={'default'} size={'lg'}>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProjectDisclaimerDialog
