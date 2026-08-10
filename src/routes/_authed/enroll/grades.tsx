// routes/_authed/enroll/grades.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authed/enroll/grades')({
  component: EncodeGrades,
})

function EncodeGrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Encode Grades</CardTitle>
        <CardDescription>
          Input grades for your enrolled subjects this term.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Grade input form goes here.
      </CardContent>
    </Card>
  )
}
