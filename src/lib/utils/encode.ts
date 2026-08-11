import { TERM_ORDER } from './enroll'

export const GRADE_VALUES = [
  1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5,
] as const

export type GradeValue = (typeof GRADE_VALUES)[number]

type EnrollmentForGradingRow = {
  enrollmentId: number
  periodId: number
  startYear: number
  endYear: number
  term: keyof typeof TERM_ORDER
  subjectCode: string
  subjectName: string
  units: number
  finalGrade: string | null
}

export function groupEnrollmentsByTerm(rows: EnrollmentForGradingRow[]) {
  const map = new Map<
    number,
    {
      periodId: number
      startYear: number
      endYear: number
      term: keyof typeof TERM_ORDER
      subjects: Omit<
        EnrollmentForGradingRow,
        'periodId' | 'startYear' | 'endYear' | 'term'
      >[]
    }
  >()

  for (const row of rows) {
    const { periodId, startYear, endYear, term, ...subject } = row
    const existing = map.get(periodId)

    if (existing) {
      existing.subjects.push(subject)
    } else {
      map.set(periodId, {
        periodId,
        startYear,
        endYear,
        term,
        subjects: [subject],
      })
    }
  }

  return [...map.values()]
    .sort(
      (a, b) =>
        a.startYear - b.startYear || TERM_ORDER[a.term] - TERM_ORDER[b.term],
    )
    .map((group) => ({
      ...group,
      isSubmitted: group.subjects.every((s) => s.finalGrade !== null),
    }))
}
