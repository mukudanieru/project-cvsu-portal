import {
  students,
  sections,
  courses,
  enrollments,
  subjectOfferings,
  offeringSchedules,
  subjects,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, sql, and } from 'drizzle-orm'
import type { RegFormRow } from '#/lib/utils/regform'
import { getSelectedPeriodQuery } from '../academic.server'

export async function getRegFormInformationQuery(
  studentId: string,
  periodId: number,
) {
  return await db
    .select({
      studentNumber: students.studentNumber,
      studentName: sql<string>`${students.firstName} || ' ' || substr(${students.middleName}, 1, 1) || '. ' || ${students.lastName}`,
      courseAndYear: sql<string>`${courses.courseCode} || ' - ' || ${sections.yearLevel}`,
      address: students.address,
      section: sql<string>`${courses.courseCode} || ${sections.yearLevel} || '-' || ${sections.sectionNumber}`,
      scheduleCode: subjectOfferings.scheduleCode,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      units: subjects.units,
      day: offeringSchedules.day,
      timeStart: offeringSchedules.timeStart,
      timeEnd: offeringSchedules.timeEnd,
    })
    .from(students)
    .innerJoin(sections, eq(students.sectionId, sections.id))
    .innerJoin(courses, eq(sections.courseId, courses.id))
    .innerJoin(enrollments, eq(students.id, enrollments.studentId))
    .innerJoin(
      subjectOfferings,
      eq(enrollments.subjectOfferingId, subjectOfferings.id),
    )
    .innerJoin(subjects, eq(subjectOfferings.subjectId, subjects.id))
    .leftJoin(
      offeringSchedules,
      eq(subjectOfferings.id, offeringSchedules.subjectOfferingId),
    )
    .where(
      and(eq(students.id, studentId), eq(subjectOfferings.periodId, periodId)),
    )
    .orderBy(subjectOfferings.scheduleCode, offeringSchedules.day)
}

export type RegFormQueryRow = Awaited<
  ReturnType<typeof getRegFormInformationQuery>
>[number]

// Orchestration: student's selected period drives the lookup; term/
// startYear/endYear come from that period, not a second DB round trip.
export async function getRegFormForStudent(studentId: string) {
  const period = await getSelectedPeriodQuery(studentId)

  if (period.length === 0) {
    return { period: null, rows: [] as Array<RegFormRow> }
  }

  const queryRows = await getRegFormInformationQuery(studentId, period[0].id)

  const semester = period[0].term
  const schoolYear = `${period[0].startYear}-${period[0].endYear}`

  const rows: Array<RegFormRow> = queryRows.map((row) => ({
    ...row,
    semester,
    schoolYear,
  }))

  return { period: period[0], rows }
}
