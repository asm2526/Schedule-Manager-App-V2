
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function generateMonthDays(year, month) {
  // Create a Date object at the start of the month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  let current = new Date(firstDay)

  // Pad with empty days before the 1st
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }

  // Add actual days of the month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  return days
}

export default function Calendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const days = generateMonthDays(year, month)

  // Mock events
  const events = {
    5: [{ title: "Doctor", color: "bg-red-400" }],
    12: [{ title: "Meeting", color: "bg-green-400" }],
    18: [{ title: "Birthday", color: "bg-blue-400" }],
  }

  return (
    <div className="p-4">
      {/* Month Header */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h2>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className="border rounded-lg h-24 p-1 text-sm flex flex-col"
          >
            {day && (
              <>
                <span className="font-bold">{day.getDate()}</span>
                <div className="flex flex-col gap-1 mt-1">
                  {events[day.getDate()]?.map((event, i) => (
                    <div
                      key={i}
                      className={`text-white text-xs rounded px-1 ${event.color}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
