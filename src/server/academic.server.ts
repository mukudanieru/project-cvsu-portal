import { desc, eq, sql } from 'drizzle-orm'
import {
  academicPeriods,
  enrollments,
  selectedPeriods,
  subjectOfferings,
  students,
} from '#/db/schema'
import { db } from '#/db/drizzle'

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

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

export async function getStudentEnrollmentInfoQuery(studentId: string) {
  const [student] = await db
    .select({
      sectionId: students.sectionId,
      isEnrolled: students.isEnrolled,
    })
    .from(students)
    .where(eq(students.id, studentId))

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return student ?? null
}

const termRank = sql<number>`CASE ${academicPeriods.term}
  WHEN 'first' THEN 1
  WHEN 'second' THEN 2
  WHEN 'summer' THEN 3
END`

export async function getEnrolledPeriodsQuery(studentId: string) {
  return await db
    .select({
      id: academicPeriods.id,
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
    })
    .from(enrollments)
    .innerJoin(
      subjectOfferings,
      eq(subjectOfferings.id, enrollments.subjectOfferingId),
    )
    .innerJoin(
      academicPeriods,
      eq(academicPeriods.id, subjectOfferings.periodId),
    )
    .where(eq(enrollments.studentId, studentId))
    .groupBy(
      academicPeriods.id,
      academicPeriods.startYear,
      academicPeriods.endYear,
      academicPeriods.term,
    )
    .orderBy(
      desc(academicPeriods.startYear),
      desc(academicPeriods.endYear),
      desc(termRank),
    )
}

export type EnrolledPeriod = Awaited<
  ReturnType<typeof getEnrolledPeriodsQuery>
>[number]

export async function upsertSelectedPeriodQuery(
  tx: Transaction,
  studentId: string,
  periodId: number,
) {
  const [selected] = await tx
    .insert(selectedPeriods)
    .values({ studentId, periodId })
    .onConflictDoUpdate({
      target: selectedPeriods.studentId,
      set: { periodId },
    })
    .returning()

  return selected
}
