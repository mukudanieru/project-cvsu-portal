import {
  enrollments,
  subjects,
  subjectOfferings,
  offeringSchedules,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and } from 'drizzle-orm'
import { getSelectedPeriodQuery } from '../academic.server'

export async function getSubjectOfferingSchedulesQuery(
  studentId: string,
  periodId: number,
) {
  return await db
    .select({
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      day: offeringSchedules.day,
      timeStart: offeringSchedules.timeStart,
      timeEnd: offeringSchedules.timeEnd,
      classMode: offeringSchedules.classMode,
    })
    .from(enrollments)
    .innerJoin(
      subjectOfferings,
      eq(subjectOfferings.id, enrollments.subjectOfferingId),
    )
    .innerJoin(subjects, eq(subjects.id, subjectOfferings.subjectId))
    .innerJoin(
      offeringSchedules,
      eq(offeringSchedules.subjectOfferingId, subjectOfferings.id),
    )
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(subjectOfferings.periodId, periodId),
      ),
    )
    .orderBy(offeringSchedules.day, offeringSchedules.timeStart)
}

export type OfferingSchedule = Awaited<
  ReturnType<typeof getSubjectOfferingSchedulesQuery>
>[number]

// Orchestration: mirrors subject.server.ts — student's selected
// period drives everything, no institutional "current period".
export async function getSchedulesForStudent(studentId: string) {
  const period = await getSelectedPeriodQuery(studentId)

  if (period.length === 0) {
    return { period: null, schedules: [] as Array<OfferingSchedule> }
  }

  const schedules = await getSubjectOfferingSchedulesQuery(
    studentId,
    period[0].id,
  )

  return { period: period[0], schedules }
}
