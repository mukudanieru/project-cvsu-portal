import {
  HOUR_START,
  HOURS,
  ROW_HEIGHT,
  parseHour,
  formatHourLabel,
  getActiveDays,
} from '#/lib/utils/schedules'
import type { ScheduleItem } from '#/lib/utils/schedules'
import ScheduleCard from './ScheduleCard'

const ScheduleDesktopGrid = ({
  scheduleData,
}: {
  scheduleData: ScheduleItem[]
}) => {
  const activeDays = getActiveDays(scheduleData)

  const sessionsByDay = Object.fromEntries(
    activeDays.map((day) => [day, scheduleData.filter((s) => s.day === day)]),
  )

  return (
    <div className="w-full rounded-lg border border-border bg-card overflow-hidden">
      {/* Day header row */}
      <div
        className="grid w-full border-b border-border"
        style={{
          gridTemplateColumns: `72px repeat(${activeDays.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="bg-muted border-r border-border" />
        {activeDays.map((day, i) => (
          <div
            key={day}
            className={`bg-muted px-3 py-2.5 text-center ${
              i < activeDays.length - 1 ? 'border-r border-border' : ''
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground capitalize tracking-wide">
              {day}
            </p>
          </div>
        ))}
      </div>

      {/* Scrollable grid body */}
      <div className="overflow-y-auto" style={{ maxHeight: 600 }}>
        <div
          className="grid w-full relative"
          style={{
            gridTemplateColumns: `72px repeat(${activeDays.length}, minmax(0, 1fr))`,
            height: HOURS.length * ROW_HEIGHT,
          }}
        >
          {/* Time labels column */}
          <div className="border-r border-border relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full flex items-start justify-end pr-2 pt-1"
                style={{
                  top: (hour - HOUR_START) * ROW_HEIGHT,
                  height: ROW_HEIGHT,
                }}
              >
                <span className="text-[11px] text-muted-foreground tabular-nums leading-none">
                  {formatHourLabel(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {activeDays.map((day, i) => (
            <div
              key={day}
              className={`relative ${i < activeDays.length - 1 ? 'border-r border-border' : ''}`}
            >
              {/* Hour lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-border/40"
                  style={{ top: (hour - HOUR_START) * ROW_HEIGHT }}
                />
              ))}

              {/* Session blocks */}
              {(sessionsByDay[day] ?? []).map((item, j) => {
                const startDecimal = parseHour(item.timeStart)
                const endDecimal = parseHour(item.timeEnd)
                const top = (startDecimal - HOUR_START) * ROW_HEIGHT
                const height = (endDecimal - startDecimal) * ROW_HEIGHT

                return (
                  <div
                    key={`${item.subjectCode}-${j}`}
                    className="absolute left-1.5 right-1.5"
                    style={{ top: top + 2, height: height - 4 }}
                  >
                    <ScheduleCard item={item} showTime={false} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScheduleDesktopGrid
