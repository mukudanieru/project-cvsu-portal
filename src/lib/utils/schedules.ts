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

// MOBILE
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

export function getDurationInHours(timeStart: string, timeEnd: string): number {
  const start = parseTime(timeStart)
  const end = parseTime(timeEnd)

  const startTotalMinutes = start.hours * 60 + start.minutes
  const endTotalMinutes = end.hours * 60 + end.minutes

  return (endTotalMinutes - startTotalMinutes) / 60
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

// DESKTOP
export const HOUR_START = 7
export const HOUR_END = 19
export const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => HOUR_START + i,
)
export const ROW_HEIGHT = 120 // px per hour

export function parseHour(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return h + m / 60
}

export function formatHourLabel(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:00 ${hour < 12 ? 'AM' : 'PM'}`
}

export function getActiveDays(data: ScheduleItem[]) {
  const activeDaySet = new Set(data.map((s) => s.day))
  return ALL_DAYS.filter((d) => activeDaySet.has(d))
}
