import { courses, sections, students } from '@/db/schema'
import { generateCandidateStudentNumber } from './register.utils'
import { db } from '@/db/drizzle'
import { eq, asc } from 'drizzle-orm'

export async function getCoursesQuery() {
  return await db
    .select({
      id: courses.id,
      courseName: courses.courseName,
    })
    .from(courses)
    .orderBy(asc(courses.courseName))
}

export async function getSectionsByCourseIdQuery(courseId: number) {
  return await db
    .select({
      sectionId: sections.id,
      courseCode: courses.courseCode,
      yearLevel: sections.yearLevel,
      sectionNumber: sections.sectionNumber,
    })
    .from(sections)
    .innerJoin(courses, eq(sections.courseId, courses.id))
    .where(eq(sections.courseId, courseId))
    .orderBy(asc(sections.yearLevel), asc(sections.sectionNumber))
}

export async function isStudentNumberTakenQuery(studentNumber: string) {
  const existing = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.studentNumber, studentNumber))
    .limit(1)

  return existing.length > 0
}

export async function generateUniqueStudentNumber() {
  const MAX_ATTEMPTS = 5

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = generateCandidateStudentNumber()
    const taken = await isStudentNumberTakenQuery(candidate)
    if (!taken) return candidate
  }

  throw new Error(
    'Could not generate a unique student number after several attempts',
  )
}
