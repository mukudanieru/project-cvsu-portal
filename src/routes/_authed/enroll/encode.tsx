import { createFileRoute } from '@tanstack/react-router'
import { getGradeEntryData } from '#/server/enroll/encode.functions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import EncodeNotEnrolled from '#/components/EncodePage/EncodeNotEnrolled'
import EncodeTerms from '#/components/EncodePage/EncodeTerms'
import EncodeLoadingState from '#/components/EncodePage/EncodeLoadingState'

export const Route = createFileRoute('/_authed/enroll/encode')({
  loader: async () => getGradeEntryData(),
  pendingMs: 200,
  pendingMinMs: 400,
  pendingComponent: EncodeLoadingState,
  component: EncodeGrades,
})

function EncodeGrades() {
  const result = Route.useLoaderData()

  if ('error' in result) {
    return (
      <div className="flex justify-center items-center">
        <WarningMessage error={result.error} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encode grades</CardTitle>
        <CardDescription>
          Input grades for your enrolled subjects, one term at a time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result.isEnrolled ? (
          <EncodeTerms terms={result.terms} />
        ) : (
          <EncodeNotEnrolled />
        )}
      </CardContent>
    </Card>
  )
}
