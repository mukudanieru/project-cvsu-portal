export function generateCandidateStudentNumber(): string {
  const suffix = Math.floor(Math.random() * 1e8)
    .toString()
    .padStart(8, '0')
  return `2${suffix}`
}
