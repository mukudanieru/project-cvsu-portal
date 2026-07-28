import {
  students,
  sections,
  enrollments,
  subjectOfferings,
  academicPeriods,
  offeringSchedules,
  subjects,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, sql, and } from 'drizzle-orm'
import type { RegFormRow } from '#/lib/utils/regform'

export async function getRegFormInformation(
  studentID: string,
): Promise<RegFormRow[]> {
  return await db
    .select({
      studentNumber: students.studentNumber,
      studentName: sql<string>`${students.firstName} || ' ' || substr(${students.middleName}, 1, 1) || '. ' || ${students.lastName}`,
      courseAndYear: sql<string>`${sections.programCode} || ' - ' || ${sections.yearLevel}`,
      address: students.address,
      section: sql<string>`${sections.programCode} || ${sections.yearLevel} || '-' || ${sections.sectionNumber}`,
      semester: academicPeriods.term,
      schoolYear: sql<string>`${academicPeriods.startYear} || '-' || ${academicPeriods.endYear}`,
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
    .innerJoin(enrollments, eq(students.id, enrollments.studentId))
    .innerJoin(
      subjectOfferings,
      eq(enrollments.subjectOfferingId, subjectOfferings.id),
    )
    .innerJoin(
      academicPeriods,
      eq(subjectOfferings.periodId, academicPeriods.id),
    )
    .innerJoin(subjects, eq(subjectOfferings.subjectId, subjects.id))
    .leftJoin(
      offeringSchedules,
      eq(subjectOfferings.id, offeringSchedules.subjectOfferingId),
    )
    .where(and(eq(students.id, studentID), eq(academicPeriods.isCurrent, true)))
}
