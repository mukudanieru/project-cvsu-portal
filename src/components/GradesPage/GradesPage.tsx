import { parseGroupedGrades } from '#/lib/utils/grades'
import type { AcademicYearGrades } from '#/lib/utils/grades'
import TitleSection from '../AuthedRoute/TitleSection'
import GradesTable from './GradesTable'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import StatCard from './StatsCard'
import { Layers, BookText, Captions, Calendar } from 'lucide-react'

import { useMemo } from 'react'

const GradesPage = ({
  academicYearGrades,
}: {
  academicYearGrades: AcademicYearGrades[]
}) => {
  const terms = parseGroupedGrades(academicYearGrades)

  const { totalUnits, weightedSum, subjectCount } = useMemo(() => {
    return terms.reduce(
      (acc, sem) => {
        const termUnits = sem.grades.reduce((s, g) => s + g.units, 0)
        return {
          totalUnits: acc.totalUnits + termUnits,
          weightedSum: acc.weightedSum + sem.gwa * termUnits,
          subjectCount: acc.subjectCount + sem.grades.length,
        }
      },
      { totalUnits: 0, weightedSum: 0, subjectCount: 0 },
    )
  }, [terms])

  const cumulativeGwa =
    totalUnits > 0 ? Number((weightedSum / totalUnits).toFixed(2)) : null

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Grades'} />
      </div>

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
                <GradesTable semesterInfo={sem} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <StatCard
          icon={Captions}
          label="Cumulative GWA"
          value={cumulativeGwa}
        />
        <StatCard icon={Layers} label="Units earned" value={totalUnits} />
        <StatCard
          icon={Calendar}
          label="Terms completed"
          value={terms.length}
        />
        <StatCard
          icon={BookText}
          label="Subjects completed"
          value={subjectCount}
        />
      </div>
    </div>
  )
}

export default GradesPage
