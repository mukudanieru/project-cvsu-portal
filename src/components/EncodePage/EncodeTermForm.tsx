import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitTermGrades } from '#/server/enroll/encode.functions'
import { GRADE_VALUES } from '#/lib/utils/encode'
import type { GradeValue } from '#/lib/utils/encode'

type Subject = {
  enrollmentId: number
  subjectCode: string
  subjectName: string
  units: number
  finalGrade: string | null
}

type FormValues = {
  grades: { enrollmentId: number; grade: GradeValue | undefined }[]
}

const EncodeTermForm = ({
  periodId,
  subjects,
}: {
  periodId: number
  subjects: Subject[]
}) => {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      grades: subjects.map((s) => ({
        enrollmentId: s.enrollmentId,
        grade: undefined,
      })),
    },
  })

  function handleGenerate() {
    setIsGenerating(true)

    setTimeout(() => {
      subjects.forEach((_, i) => {
        const random =
          GRADE_VALUES[Math.floor(Math.random() * GRADE_VALUES.length)]
        setValue(`grades.${i}.grade`, random)
      })
      setIsGenerating(false)
    }, 300)
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const result = await submitTermGrades({
        data: {
          periodId,
          grades: values.grades as {
            enrollmentId: number
            grade: GradeValue
          }[],
        },
      })

      if ('error' in result) {
        toast.error(result.error.title, {
          description: result.error.description,
        })
        return
      }

      toast.success('Grades submitted')
      await router.invalidate()
    } finally {
      setIsSubmitting(false)
    }
  }

  function onInvalid() {
    toast.error('Incomplete submission', {
      description: 'Every subject needs a grade before submitting.',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="flex flex-col gap-4"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-center">Units</TableHead>
            <TableHead className="text-center w-28">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject, index) => (
            <TableRow key={subject.enrollmentId}>
              <TableCell className="font-medium">
                {subject.subjectCode}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {subject.subjectName}
              </TableCell>
              <TableCell className="text-center">{subject.units}</TableCell>
              <TableCell className="text-center">
                <Controller
                  name={`grades.${index}.grade`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={
                        field.value !== undefined
                          ? String(field.value)
                          : undefined
                      }
                      onValueChange={(v) =>
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                        field.onChange(Number(v) as GradeValue)
                      }
                    >
                      <SelectTrigger className="w-24 mx-auto">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_VALUES.map((value) => (
                          <SelectItem key={value} value={String(value)}>
                            {value.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating || isSubmitting}
        >
          {isGenerating ? (
            <>
              <Spinner className="size-4" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              Generate all
            </>
          )}
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting || isGenerating}>
          {isSubmitting ? (
            <>
              <Spinner className="size-4" />
              Submitting...
            </>
          ) : (
            'Submit term'
          )}
        </Button>
      </div>
    </form>
  )
}

export default EncodeTermForm
