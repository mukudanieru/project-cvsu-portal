import type { ParsedScheduleItem } from '#/lib/utils/schedules'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, BookOpen, School } from 'lucide-react'

const ScheduleItem = ({
  item,
  showTime = true,
}: {
  item: ParsedScheduleItem
  showTime?: boolean
}) => {
  const isAsync = item.classMode === 'asynchronous'
  const ModeIcon = isAsync ? BookOpen : School

  return (
    <>
      <Card
        className={`flex flex-col border ${isAsync ? 'border-border' : 'border-primary/25'} mb-2 p-0 gap-0 ${showTime ? 'min-h-28' : ''} `}
      >
        <CardHeader
          className={`${isAsync ? 'bg-secondary/75' : 'bg-primary/75'} px-3.5 py-1.5`}
        >
          <CardTitle className="text-xs font-normal">
            {item.subjectCode}
          </CardTitle>
        </CardHeader>

        <CardContent
          className={`px-3.5 py-3 flex flex-col justify-between flex-1 ${isAsync ? 'bg-secondary/10' : 'bg-primary/10'}`}
        >
          <div
            className={`flex items-center justify-between ${!showTime ? 'flex-1' : ''}`}
          >
            <h1 className="uppercase text-md font-medium">
              {item.subjectName}
            </h1>

            {!showTime && (
              <Badge
                className="capitalize ml-2 shrink-0"
                variant={isAsync ? 'secondary' : 'default'}
              >
                <ModeIcon />

                {item.classMode}
              </Badge>
            )}
          </div>

          {showTime && (
            <div className="flex justify-between items-center text-foreground/75">
              <div className="flex gap-5 items-center">
                <Clock size={12} />
                <span className="text-xs">
                  {item.timeStart} - {item.timeEnd}
                </span>
              </div>

              <Badge
                className="capitalize"
                variant={isAsync ? 'secondary' : 'default'}
              >
                <ModeIcon />

                {item.classMode}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default ScheduleItem
