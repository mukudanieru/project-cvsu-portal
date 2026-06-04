import { createServerFn } from '@tanstack/react-start'
import { getStudentInformation } from './account.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getNavInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentAccountID = await getCurrentUserFromSession()

    if (!currentAccountID) {
      return {
        error: {
          title: 'Unauthorized',
          description: 'You must be logged in to access this resource.',
        },
      }
    }

    const studentInformation = await getStudentInformation(currentAccountID)

    if (!studentInformation) {
      return {
        error: {
          title: 'Student Not Found',
          description: 'No student record is associated with this account.',
        },
      }
    }

    return {
      accountID: currentAccountID,
      studentNumber: studentInformation.students.studentNumber,
      fullName: `${studentInformation.students.firstName} ${studentInformation.students.lastName}`,
    }
  },
)
