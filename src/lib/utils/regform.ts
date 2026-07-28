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
  day: string | null
  timeStart: string | null
  timeEnd: string | null
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

export interface ScheduleEntry {
  day: string
  timeStart: string
  timeEnd: string
}

export interface SubjectEntry {
  scheduleCode: string
  subjectCode: string
  subjectName: string
  units: number
  schedules: ScheduleEntry[]
}

export interface RegFormData {
  studentInformation: StudentInformation
  subjects: SubjectEntry[]
}

export function buildRegForm(rows: RegFormRow[]): RegFormData {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const first = rows[0]!

  const subjectMap = new Map<string, SubjectEntry>()

  for (const row of rows) {
    let subject = subjectMap.get(row.scheduleCode)
    if (!subject) {
      subject = {
        scheduleCode: row.scheduleCode,
        subjectCode: row.subjectCode,
        subjectName: row.subjectName,
        units: row.units,
        schedules: [],
      }
      subjectMap.set(row.scheduleCode, subject)
    }

    if (row.day !== null && row.timeStart !== null && row.timeEnd !== null) {
      subject.schedules.push({
        day: row.day,
        timeStart: row.timeStart,
        timeEnd: row.timeEnd,
      })
    }
  }

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
    subjects: Array.from(subjectMap.values()),
  }
}
