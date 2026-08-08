import { createServerFn } from '@tanstack/react-start'
import { getStudentInformationQuery } from './account.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getNavInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const currentUser = await getCurrentUserFromSession()

      if (!currentUser) {
        return {
          error: {
            title: 'Unauthorized',
            description: 'You must be logged in to access this resource.',
          },
        }
      }

      const studentInformation = await getStudentInformationQuery(
        currentUser.accountID,
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!studentInformation) {
        return {
          error: {
            title: 'Student Not Found',
            description: 'No student record is associated with this account.',
          },
        }
      }

      return {
        accountID: currentUser.accountID,
        studentNumber: studentInformation.students.studentNumber,
        fullName: `${studentInformation.students.firstName} ${studentInformation.students.lastName}`,
      }
    } catch {
      return {
        error: {
          title: 'Something went wrong',
          description: 'Could not load your navigation info. Please try again.',
        },
      }
    }
  },
)

export const getAccountInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const currentUser = await getCurrentUserFromSession()

      if (!currentUser) {
        return {
          error: {
            title: 'Unauthorized',
            description: 'You must be logged in to access this resource.',
          },
        }
      }

      const studentInformation = await getStudentInformationQuery(
        currentUser.accountID,
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!studentInformation) {
        return {
          error: {
            title: 'Student Not Found',
            description: 'No student record is associated with this account.',
          },
        }
      }

      const middleInitial = studentInformation.students.middleName?.[0]
        ? `${studentInformation.students.middleName[0]}.`
        : undefined

      const fullName = [
        studentInformation.students.firstName,
        middleInitial,
        studentInformation.students.lastName,
      ]
        .filter(Boolean)
        .join(' ')

      const birthday = new Date(
        studentInformation.students.birthday,
      ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      return {
        universityEmail: studentInformation.accounts.universityEmail,
        studentNumber: studentInformation.students.studentNumber,
        fullName,
        isEnrolled: studentInformation.students.isEnrolled,
        sex: studentInformation.students.sex,
        address: studentInformation.students.address,
        relationshipStatus: studentInformation.students.relationshipStatus,
        birthday,
        citizenship: studentInformation.students.citizenship,
        guardian: studentInformation.students.guardian,
        courseCode: studentInformation.course?.courseCode,
        courseName: studentInformation.course?.courseName,
        department: studentInformation.department?.name,
      }
    } catch {
      return {
        error: {
          title: 'Something went wrong',
          description: 'Could not load your account info. Please try again.',
        },
      }
    }
  },
)
