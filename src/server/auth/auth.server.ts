import { students } from '@/db/schema'
import { useAppSession } from '@/lib/session'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function findStudentByStudentNumber(studentNumber: string) {
  return db.query.students.findFirst({
    where: eq(students.studentNumber, studentNumber),
    with: { account: true },
  })
}

export async function getCurrentUserFromSession(): Promise<{
  accountID: string
  studentID: string
} | null> {
  const session = await useAppSession()
  const { accountID, studentID } = session.data

  if (!accountID || !studentID) return null

  return { accountID, studentID }
}
