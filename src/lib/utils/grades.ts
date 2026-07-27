export type Term = 'first' | 'second' | 'summer'

export const termOrder: Term[] = ['first', 'second', 'summer']

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

export interface ParsedGroupedGrades {
  term: Term
  startYear: number
  endYear: number
  gwa: number
  grades: GradeEntry[]
}

export function parseGroupedGrades(
  groupedGrades: GroupedGrades,
): ParsedGroupedGrades[] {
  return groupedGrades.flatMap((year) =>
    termOrder
      .filter((term): term is Term => year.terms[term] !== undefined)
      .map((term) => {
        const termGrades = year.terms[term] as TermGrades
        return {
          term,
          startYear: year.startYear,
          endYear: year.endYear,
          gwa: termGrades.gwa,
          grades: termGrades.grades,
        }
      }),
  )
}
