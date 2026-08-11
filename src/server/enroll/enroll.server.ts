import {
  subjectOfferings,
  academicPeriods,
  sections,
  subjects,
  students,
  enrollments,
  selectedPeriods,
} from '#/db/schema'
import { eq, and, lte, inArray, asc } from 'drizzle-orm'
import { db } from '#/db/drizzle'
import { getLatestOffering } from '#/lib/utils/enroll'
import { getStudentEnrollmentInfoQuery } from '../academic.server'

// Only ever called from inside db.transaction() — see insertEnrollmentRecords.
// Worth hoisting to db/drizzle.ts if a second transactional write path shows up.
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export { getStudentEnrollmentInfoQuery }

export async function getAvailableOfferingsForStudentQuery(
  studentSectionId: number,
) {
  // 1. Resolve the student's current section -> course, section number, year level
  const [currentSection] = await db
    .select({
      courseId: sections.courseId,
      sectionNumber: sections.sectionNumber,
      yearLevel: sections.yearLevel,
    })
    .from(sections)
    .where(eq(sections.id, studentSectionId))

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!currentSection) return []

  // 2. Find every section row for the same course + section number,
  //    from year 1 up to (and including) the student's current year level
  const matchingSections = await db
    .select({ id: sections.id })
    .from(sections)
    .where(
      and(
        eq(sections.courseId, currentSection.courseId),
        eq(sections.sectionNumber, currentSection.sectionNumber),
        lte(sections.yearLevel, currentSection.yearLevel),
      ),
    )

  const sectionIds = matchingSections.map((s) => s.id)
  if (sectionIds.length === 0) return []

  // 3. Pull every subject offering tied to those sections
  return await db
    .select({
      subjectOfferingId: subjectOfferings.id,
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      scheduleCode: subjectOfferings.scheduleCode,
      units: subjects.units,
    })
    .from(subjectOfferings)
    .innerJoin(subjects, eq(subjectOfferings.subjectId, subjects.id))
    .innerJoin(
      academicPeriods,
      eq(subjectOfferings.periodId, academicPeriods.id),
    )
    .where(inArray(subjectOfferings.sectionId, sectionIds))
    .orderBy(
      asc(academicPeriods.startYear),
      asc(academicPeriods.term),
      asc(subjects.subjectCode),
    )
}

// Narrow, write-path-only version of the lookup above: just offering + period
// ids, scoped to `tx`. Deliberately not shared with the display query — that
// one needs subject names/codes for the UI, this one doesn't.
export async function getOfferingIdsForEnrollmentQuery(
  studentSectionId: number,
  tx: Transaction,
) {
  const [currentSection] = await tx
    .select({
      courseId: sections.courseId,
      sectionNumber: sections.sectionNumber,
      yearLevel: sections.yearLevel,
    })
    .from(sections)
    .where(eq(sections.id, studentSectionId))

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!currentSection) return []

  const matchingSections = await tx
    .select({ id: sections.id })
    .from(sections)
    .where(
      and(
        eq(sections.courseId, currentSection.courseId),
        eq(sections.sectionNumber, currentSection.sectionNumber),
        lte(sections.yearLevel, currentSection.yearLevel),
      ),
    )

  const sectionIds = matchingSections.map((s) => s.id)
  if (sectionIds.length === 0) return []

  return await tx
    .select({
      subjectOfferingId: subjectOfferings.id,
      periodId: subjectOfferings.periodId,
      startYear: academicPeriods.startYear,
      term: academicPeriods.term,
    })
    .from(subjectOfferings)
    .innerJoin(
      academicPeriods,
      eq(subjectOfferings.periodId, academicPeriods.id),
    )
    .where(inArray(subjectOfferings.sectionId, sectionIds))
}

export type EnrollmentOfferingRow = Awaited<
  ReturnType<typeof getOfferingIdsForEnrollmentQuery>
>[number]

// Orchestration: insert every offering as an enrollment, point selectedPeriods
// at the latest one, flip isEnrolled. All-or-nothing.
export async function insertEnrollmentRecords(
  studentId: string,
  studentSectionId: number,
) {
  await db.transaction(async (tx) => {
    const offeringRows = await getOfferingIdsForEnrollmentQuery(
      studentSectionId,
      tx,
    )

    const latest = getLatestOffering(offeringRows)

    if (!latest) {
      throw new Error('NO_OFFERINGS')
    }

    await tx
      .insert(enrollments)
      .values(
        offeringRows.map((row) => ({
          studentId,
          subjectOfferingId: row.subjectOfferingId,
        })),
      )
      .onConflictDoNothing()

    await tx
      .insert(selectedPeriods)
      .values({ studentId, periodId: latest.periodId })
      .onConflictDoUpdate({
        target: selectedPeriods.studentId,
        set: { periodId: latest.periodId },
      })

    await tx
      .update(students)
      .set({ isEnrolled: true })
      .where(eq(students.id, studentId))
  })
}
