import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import EncodeTermForm from './EncodeTermForm'
import EncodeTermSubmitted from './EncodeTermSubmitted'
import type { getGradeEntryData } from '#/server/enroll/encode.functions'

type EnrolledResult = Extract<
  Awaited<ReturnType<typeof getGradeEntryData>>,
  { isEnrolled: true }
>

const EncodeTerms = ({ terms }: { terms: EnrolledResult['terms'] }) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={terms.map((t) => String(t.periodId))}
    >
      {terms.map((term) => {
        const id = String(term.periodId)

        return (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger className="flex items-center px-4 py-3.5 hover:no-underline hover:cursor-pointer">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-semibold capitalize">
                  {term.term} term
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light text-muted-foreground">
                    AC {term.startYear} - {term.endYear}
                  </span>
                  {term.isSubmitted && (
                    <Badge variant="secondary">Submitted</Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {term.isSubmitted ? (
                <EncodeTermSubmitted />
              ) : (
                <EncodeTermForm
                  periodId={term.periodId}
                  subjects={term.subjects}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default EncodeTerms
