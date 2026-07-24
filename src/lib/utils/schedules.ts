/* eslint-disable @typescript-eslint/no-unnecessary-condition */
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

type ClassMode = 'synchronous' | 'asynchronous'

export interface ScheduleItem {
  subjectCode: string
  subjectName: string
  day: DayOfWeek
  timeStart: string // "HH:MM:SS"
  timeEnd: string // "HH:MM:SS"
  classMode: ClassMode
}

export interface ParsedScheduleItem {
  subjectCode: string
  subjectName: string
  timeStart: string // "HH:MM AM or PM" - Standard Time
  timeEnd: string // "HH:MM AM or PM" - Standard Time
  classMode: ClassMode
}

export const ALL_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

// HELPER FUNCTIONS
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

export function getDuration(timeStart: string, endStart: string): number {
  return parseTime(timeStart).hours - parseTime(endStart).hours
}

export function formatTimeString(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes))

  return new Intl.DateTimeFormat('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export type GroupedSchedule = Partial<Record<DayOfWeek, ParsedScheduleItem[]>>

export function groupByDay(scheduleData: ScheduleItem[]): GroupedSchedule {
  const sortedData = [...scheduleData].sort((a, b) =>
    a.timeStart.localeCompare(b.timeStart),
  )

  const unorderedGroup = sortedData.reduce<GroupedSchedule>((acc, item) => {
    const { day, timeStart, timeEnd, subjectCode, subjectName, classMode } =
      item

    if (!acc[day]) {
      acc[day] = []
    }

    // TypeScript non-null assertion since we initialized it above
    acc[day].push({
      subjectCode,
      subjectName,
      timeStart: formatTimeString(timeStart),
      timeEnd: formatTimeString(timeEnd),
      classMode,
    })

    return acc
  }, {})

  const sortedResult: GroupedSchedule = {}

  ALL_DAYS.forEach((day) => {
    if (unorderedGroup[day]) {
      sortedResult[day] = unorderedGroup[day]
    }
  })

  return sortedResult
}
