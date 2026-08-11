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
import { Badge } from '@/components/ui/badge'
import { getAvailableOfferingsForStudent } from '#/server/enroll/enroll.functions'
import SubjectsTable from '#/components/EnrollPage/SubjectsTable'
import EnrollButton from '#/components/EnrollPage/EnrollButton'

export const Route = createFileRoute('/_authed/enroll/')({
  loader: async () => {
    return getAvailableOfferingsForStudent()
  },

  component: EnrollSubjects,
})

function EnrollSubjects() {
  const result = Route.useLoaderData()

  if ('error' in result) {
    return (
      <div className="flex justify-center items-center">
        <WarningMessage error={result.error} />
      </div>
    )
  }

  const { isEnrolled, terms } = result

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            {isEnrolled
              ? 'You are all set and enrolled in this curriculum!'
              : 'Explore the subjects below and click enroll to join the entire curriculum.'}
          </CardDescription>
        </div>
        {isEnrolled && <Badge variant="secondary">Enrolled</Badge>}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <Accordion type="multiple">
          {terms.map((sem) => {
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
          <EnrollButton disabled={isEnrolled} />
        </div>
      </CardContent>
    </Card>
  )
}
