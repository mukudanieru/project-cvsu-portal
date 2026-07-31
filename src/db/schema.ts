import {
  uuid,
  integer,
  decimal,
  pgEnum,
  pgTable,
  varchar,
  date,
  time,
  boolean,
  unique,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const studentStatusEnum = pgEnum('student_status', [
  'regular',
  'irregular',
])

export const sexEnum = pgEnum('sex', ['male', 'female'])

export const academicTermEnum = pgEnum('academic_term', [
  'first',
  'second',
  'summer',
])

export const dayEnum = pgEnum('day', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
])

export const classModeEnum = pgEnum('class_mode', [
  'synchronous',
  'asynchronous',
])

// Tables
export const departments = pgTable('departments', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 100 }).notNull().unique(),
})

export const courses = pgTable(
  'courses',
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    courseCode: varchar('course_code', { length: 50 }).notNull().unique(),
    courseName: varchar('course_name', { length: 255 }).notNull(),
    departmentId: integer('department_id')
      .notNull()
      .references(() => departments.id),
  },
  (table) => [index('department_idx').on(table.departmentId)],
)

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id')
    .notNull()
    .unique()
    .references(() => students.id, { onDelete: 'cascade' }),
  universityEmail: varchar('university_email', { length: 255 })
    .notNull()
    .unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
})

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentNumber: varchar('student_number', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  courseId: integer('course_id')
    .references(() => courses.id)
    .notNull(),
  sectionId: integer('section_id')
    .references(() => sections.id)
    .notNull(),
  studentStatus: studentStatusEnum('student_status')
    .default('regular')
    .notNull(),
  sex: sexEnum('sex').notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  relationshipStatus: varchar('relationship_status').default('single'),
  birthday: date('birthday').notNull(),
  citizenship: varchar('citizenship', { length: 100 }).notNull(),
  guardian: varchar('guardian', { length: 255 }),
})

export const faculty = pgTable('faculty', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  facultyNumber: varchar('faculty_number', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('faculty_email', { length: 255 }).notNull().unique(),
})

export const academicPeriods = pgTable('academic_periods', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  startYear: integer('start_year').notNull(),
  endYear: integer('end_year').notNull(),
  term: academicTermEnum('term').notNull(),
  isCurrent: boolean('is_current').notNull().default(false),
})

export const sections = pgTable(
  'sections',
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    programCode: varchar('program_code', { length: 24 }).notNull(),
    yearLevel: integer('year_level').notNull(),
    sectionNumber: integer('section_number').notNull(),
    facultyId: integer('faculty_id')
      .references(() => faculty.id)
      .notNull(),
  },
  (table) => [index('sections_faculty_id_idx').on(table.facultyId)],
)

export const subjects = pgTable('subjects', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  subjectCode: varchar('subject_code', { length: 50 }).notNull().unique(),
  subjectName: varchar('subject_name', { length: 100 }).notNull(),
  units: integer('units').notNull(),
})

export const subjectOfferings = pgTable('subject_offerings', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  sectionId: integer('section_id')
    .references(() => sections.id)
    .notNull(),
  periodId: integer('period_id')
    .references(() => academicPeriods.id)
    .notNull(),
  facultyId: integer('faculty_id')
    .references(() => faculty.id)
    .notNull(),
  scheduleCode: varchar('schedule_code', { length: 50 }).notNull().unique(),
  slots: integer('slots'),
})

export const offeringSchedules = pgTable('offering_schedules', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  subjectOfferingId: integer('subject_offering_id')
    .references(() => subjectOfferings.id)
    .notNull(),
  classMode: classModeEnum('class_mode').default('synchronous').notNull(),
  day: dayEnum('day').notNull(),
  timeStart: time('time_start').notNull(),
  timeEnd: time('time_end').notNull(),
})

export const enrollments = pgTable(
  'enrollments',
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    studentId: uuid('student_id')
      .references(() => students.id)
      .notNull(),
    subjectOfferingId: integer('subject_offering_id')
      .references(() => subjectOfferings.id)
      .notNull(),
  },
  (table) => [
    unique('enrollments_student_offering_unique').on(
      table.studentId,
      table.subjectOfferingId,
    ),
  ],
)

export const grades = pgTable('grades', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  enrollmentId: integer('enrollment_id')
    .references(() => enrollments.id)
    .notNull()
    .unique(),
  finalGrade: decimal('final_grade', { precision: 3, scale: 2 }).notNull(),
})

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  students: many(students),
}))

export const studentsRelations = relations(students, ({ one }) => ({
  course: one(courses, {
    fields: [students.courseId],
    references: [courses.id],
  }),
  account: one(accounts, {
    fields: [students.id],
    references: [accounts.studentId],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  student: one(students, {
    fields: [accounts.studentId],
    references: [students.id],
  }),
}))
