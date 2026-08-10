import type { academicTermEnum } from '#/db/schema'

type AcademicTerm = (typeof academicTermEnum.enumValues)[number]

type OfferingRow = {
  startYear: number
  endYear: number
  term: AcademicTerm
  subjectCode: string
  subjectName: string
  scheduleCode: string
  units: number
}

export type Subject = {
  subjectCode: string
  subjectName: string
  scheduleCode: string
}

export type TermGroup = {
  startYear: number
  endYear: number
  term: AcademicTerm
  subjects: Subject[]
}

/**
 * Groups a flat list of offering rows into per-term buckets.
 * Assumes rows are already ordered chronologically (per the
 * query's ORDER BY), so groups come out in term order as-is.
 */
export function groupOfferingsByTerm(rows: OfferingRow[]): TermGroup[] {
  const groups: TermGroup[] = []

  for (const row of rows) {
    const lastGroup = groups[groups.length - 1]
    const sameTerm =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      lastGroup &&
      lastGroup.startYear === row.startYear &&
      lastGroup.endYear === row.endYear &&
      lastGroup.term === row.term

    if (!sameTerm) {
      groups.push({
        startYear: row.startYear,
        endYear: row.endYear,
        term: row.term,
        subjects: [],
      })
    }

    groups[groups.length - 1].subjects.push({
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      scheduleCode: row.scheduleCode,
    })
  }

  return groups
}

const TERM_ORDER = { first: 0, second: 1, summer: 2 } as const

export function getLatestOffering<
  T extends { startYear: number; term: keyof typeof TERM_ORDER },
>(offerings: T[]): T | undefined {
  if (offerings.length === 0) return undefined

  return offerings.reduce((latest, row) => {
    if (row.startYear !== latest.startYear) {
      return row.startYear > latest.startYear ? row : latest
    }
    return TERM_ORDER[row.term] > TERM_ORDER[latest.term] ? row : latest
  })
}
