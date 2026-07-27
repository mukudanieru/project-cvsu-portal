export interface RegFormRow {
  studentNumber: string
  studentName: string
  courseAndYear: string
  address: string
  section: string
  semester: 'first' | 'second' | 'summer'
  schoolYear: string
  scheduleCode: string
  subjectCode: string
  subjectName: string
  units: number
}

export interface StudentInformation {
  studentNumber: string
  studentName: string
  courseAndYear: string
  address: string
  section: string
  semester: 'first' | 'second' | 'summer'
  schoolYear: string
}

export interface SubjectEntry {
  scheduleCode: string
  subjectCode: string
  subjectName: string
  units: number
}

export interface RegFormData {
  studentInformation: StudentInformation
  subjects: SubjectEntry[]
}

export function buildRegForm(rows: RegFormRow[]): RegFormData {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const first = rows[0]!

  return {
    studentInformation: {
      studentNumber: first.studentNumber,
      studentName: first.studentName,
      courseAndYear: first.courseAndYear,
      address: first.address,
      section: first.section,
      semester: first.semester,
      schoolYear: first.schoolYear,
    },
    subjects: rows.map((row) => ({
      scheduleCode: row.scheduleCode,
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      units: row.units,
    })),
  }
}
