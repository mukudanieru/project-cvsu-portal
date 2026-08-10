import { selectedPeriods, academicPeriods } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function getSelectedPeriodQuery(studentId: string) {
  return await db
    .select({
      id: academicPeriods.id,
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
    })
    .from(selectedPeriods)
    .innerJoin(
      academicPeriods,
      eq(academicPeriods.id, selectedPeriods.periodId),
    )
    .where(eq(selectedPeriods.studentId, studentId))
}

export type SelectedPeriod = Awaited<
  ReturnType<typeof getSelectedPeriodQuery>
>[number]
