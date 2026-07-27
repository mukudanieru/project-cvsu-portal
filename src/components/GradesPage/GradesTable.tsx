import type { ParsedGroupedGrades } from '#/lib/utils/grades'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const GradesTable = ({
  semesterInfo,
}: {
  semesterInfo: ParsedGroupedGrades
}) => {
  const { term, startYear, endYear, grades, gwa } = semesterInfo

  return (
    <>
      <Table>
        <TableCaption>
          The list of grades for the {term} semester of {startYear} - {endYear}.
        </TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead>Code</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-center">Grade</TableHead>
            <TableHead className="text-center">Units</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.subjectCode}>
              <TableCell>{grade.subjectCode}</TableCell>
              <TableCell>{grade.subjectName}</TableCell>
              <TableCell className="text-center">{grade.finalGrade}</TableCell>
              <TableCell className="text-center">{grade.units}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Average</TableCell>
            <TableCell colSpan={2} className="text-center">
              {gwa} GWA
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}

export default GradesTable
