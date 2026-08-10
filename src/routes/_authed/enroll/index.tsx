// routes/_authed/enroll/index.tsx
import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getAvailableOfferingsForStudent } from '#/server/enroll/enroll.functions'
import SubjectsTable from '#/components/EnrollPage/SubjectsTable'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_authed/enroll/')({
  loader: async () => {
    return getAvailableOfferingsForStudent()
  },

  component: EnrollSubjects,
})

function EnrollSubjects() {
  const offerings = Route.useLoaderData()

  if ('error' in offerings) {
    return (
      <div className="flex justify-center items-center">
        <WarningMessage error={offerings.error} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
        <CardDescription>
          Browse the curriculum subjects and click enroll to enroll in all of
          them.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <Accordion type="multiple">
          {offerings.map((sem) => {
            const id = `${sem.startYear}-${sem.endYear}-${sem.term}`

            return (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="flex items-center px-4 py-3.5 hover:no-underline hover:cursor-pointer">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">
                      {sem.term} term
                    </span>
                    <span className="text-sm font-light text-muted-foreground">
                      AC {sem.startYear} - {sem.endYear}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <SubjectsTable subjects={sem.subjects} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <div className="flex justify-end">
          <Button size={'lg'}>Enroll</Button>
        </div>
      </CardContent>
    </Card>
  )
}
