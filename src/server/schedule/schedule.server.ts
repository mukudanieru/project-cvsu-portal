import {
  enrollments,
  subjects,
  subjectOfferings,
  offeringSchedules,
  academicPeriods,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and } from 'drizzle-orm'

export async function getSubjectOfferingSchedules(studentID: string) {
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
    .innerJoin(
      academicPeriods,
      eq(academicPeriods.id, subjectOfferings.periodId),
    )
    .innerJoin(subjects, eq(subjects.id, subjectOfferings.subjectId))
    .innerJoin(
      offeringSchedules,
      eq(offeringSchedules.subjectOfferingId, subjectOfferings.id),
    )
    .where(
      and(
        eq(enrollments.studentId, studentID),
        eq(academicPeriods.isCurrent, true),
      ),
    )
}
