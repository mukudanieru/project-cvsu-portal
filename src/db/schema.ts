import { integer, pgEnum, pgTable, varchar, date } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const studentStatusEnum = pgEnum('student_status', [
  'regular',
  'irregular',
])

export const sexEnum = pgEnum('sex', ['male', 'female'])

// Tables
export const courses = pgTable('courses', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  courseCode: varchar('course_code', { length: 50 }).notNull().unique(),
  courseName: varchar('course_name', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
})

export const students = pgTable('students', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  studentNumber: varchar('student_number', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  courseId: integer('course_id').references(() => courses.id, {
    onDelete: 'set null',
  }),
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

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  studentId: integer('student_id')
    .notNull()
    .unique()
    .references(() => students.id, { onDelete: 'cascade' }),
  universityEmail: varchar('university_email', { length: 255 })
    .notNull()
    .unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
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
