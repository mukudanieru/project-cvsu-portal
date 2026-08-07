import { createServerFn } from '@tanstack/react-start'
import {
  generateUniqueStudentNumber,
  getCoursesQuery,
  getSectionsByCourseIdQuery,
} from './register.server'
import z from 'zod'

export const getCourses = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const courses = await getCoursesQuery()
      return courses
    } catch {
      return {
        error: {
          title: 'Could not load courses',
          description: 'Something went wrong fetching the course list.',
        },
      }
    }
  },
)

export const getSectionsByCourseId = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ courseId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    try {
      const sectionsByCourseId = await getSectionsByCourseIdQuery(data.courseId)

      console.log(sectionsByCourseId)

      return sectionsByCourseId
    } catch {
      return {
        error: {
          title: 'Could not load sections',
          description: 'Something went wrong fetching the section list.',
        },
      }
    }
  })

export const generateStudentNumber = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const studentNumber = await generateUniqueStudentNumber()
      return { studentNumber }
    } catch {
      return {
        error: {
          title: 'Could not generate a student number',
          description: 'Please try again.',
        },
      }
    }
  },
)
