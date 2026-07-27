import type {
  GradeRow,
  GroupedGrades,
  AcademicYearGrades,
} from '@/lib/utils/grades'

export function groupGradesByYearAndTerm(rows: GradeRow[]): GroupedGrades {
  const yearMap = new Map<string, AcademicYearGrades>()

  for (const row of rows) {
    const mapKey = `${row.startYear}-${row.endYear}`
    let year = yearMap.get(mapKey)
    if (!year) {
      year = { startYear: row.startYear, endYear: row.endYear, terms: {} }
      yearMap.set(mapKey, year)
    }
    if (!year.terms[row.term]) {
      year.terms[row.term] = { gwa: 0, grades: [] }
    }
    year.terms[row.term]!.grades.push({
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      units: row.units,
      finalGrade: row.finalGrade,
    })
  }

  for (const year of yearMap.values()) {
    for (const term of Object.values(year.terms)) {
      const weightedSum = term.grades.reduce(
        (sum, g) => sum + Number(g.finalGrade) * g.units,
        0,
      )
      const totalUnits = term.grades.reduce((sum, g) => sum + g.units, 0)
      term.gwa = Number((weightedSum / totalUnits).toFixed(2))
    }
  }

  return Array.from(yearMap.values())
}
