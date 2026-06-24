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

export async function getCurrentUserFromSession() {
  const session = await useAppSession()
  if (!session.data.accountID) return null
  return session.data.accountID
}
