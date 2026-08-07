import type { RegisterFormValues } from '#/lib/schema/register.schema'
import { hashPassword } from '#/lib/password'
import {
  generateCandidateStudentNumber,
  toPostgresDateString,
} from './register.utils'

import { accounts, courses, sections, students } from '@/db/schema'
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

export async function isUniversityEmailTakenQuery(universityEmail: string) {
  const existing = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.universityEmail, universityEmail))
    .limit(1)

  return existing.length > 0
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

export async function insertStudentAccount(registerValues: RegisterFormValues) {
  const {
    password,
    confirmPassword,
    universityEmail,
    birthday,
    ...studentFields
  } = registerValues

  const passwordHash = await hashPassword(password)

  return db.transaction(async (tx) => {
    const [student] = await tx
      .insert(students)
      .values({
        ...studentFields,
        birthday: toPostgresDateString(birthday),
      })
      .returning({ id: students.id })

    await tx.insert(accounts).values({
      studentId: student.id,
      universityEmail,
      passwordHash,
    })

    return student.id
  })
}
