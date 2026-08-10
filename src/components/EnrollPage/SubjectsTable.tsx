import type { Subject } from '#/lib/utils/enroll'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type SubjectsTableProps = {
  subjects: Subject[]
}

const SubjectsTable = ({ subjects }: SubjectsTableProps) => {
  return (
    <Table>
      <TableCaption>
        The list of available subjects and sections for enrollment.
      </TableCaption>
      <TableHeader>
        <TableRow className="font-bold">
          <TableHead>Subject Code</TableHead>
          <TableHead>Subject Description</TableHead>
          <TableHead className="text-right">Schedule Code</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.scheduleCode}>
            <TableCell>{subject.subjectCode}</TableCell>
            <TableCell>{subject.subjectName}</TableCell>
            <TableCell className="text-right">{subject.scheduleCode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SubjectsTable
