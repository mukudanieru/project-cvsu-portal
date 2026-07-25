export type Term = 'first' | 'second' | 'summer'

export interface GradeRow {
  startYear: number
  endYear: number
  term: 'first' | 'second' | 'summer'
  subjectCode: string
  subjectName: string
  units: number
  finalGrade: string
}

export interface GradeEntry {
  subjectCode: string
  subjectName: string
  units: number
  finalGrade: string
}

export interface TermGrades {
  gwa: number
  grades: GradeEntry[]
}

export interface AcademicYearGrades {
  startYear: number
  endYear: number
  terms: Partial<Record<Term, TermGrades>>
}

export type GroupedGrades = AcademicYearGrades[]
