import { useState } from 'react'
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths, parseISO } from 'date-fns'

interface PriceData {
  [date: string]: number
}

interface PriceCalendarProps {
  origin: string
  destination: string
  prices: PriceData
  loading?: boolean
  onDateSelect?: (date: string) => void
  onMonthChange?: (startDate: string, endDate: string) => void
  selectedDate?: string
  startDate?: string
}

export default function PriceCalendar({
  origin,
  destination,
  prices,
  loading = false,
  onDateSelect,
  onMonthChange,
  selectedDate,
  startDate,
}: PriceCalendarProps) {
  // Initialize calendar to the month of the search date, not today
  const initialDate = startDate ? parseISO(startDate) : new Date()
  const [currentDate, setCurrentDate] = useState(initialDate)

  // Notify parent when month changes so it can fetch new prices
  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate)
    const monthStart = format(startOfMonth(newDate), 'yyyy-MM-dd')
    const monthEnd = format(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0), 'yyyy-MM-dd')
    onMonthChange?.(monthStart, monthEnd)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = startOfMonth(currentDate).getDay()
  const monthStart = startOfMonth(currentDate)

  const getMinMaxPrices = () => {
    const priceValues = Object.values(prices).filter((p) => p > 0)
    if (priceValues.length === 0) return { min: 0, max: 1000 }
    return {
      min: Math.min(...priceValues),
      max: Math.max(...priceValues),
    }
  }

  const getPriceColor = (price: number) => {
    const { min, max } = getMinMaxPrices()
    const range = max - min
    const percentage = (price - min) / range

    if (percentage < 0.2) return '#10b981' // green - very cheap
    if (percentage < 0.4) return '#84cc16' // lime - cheap
    if (percentage < 0.6) return '#eab308' // yellow - medium
    if (percentage < 0.8) return '#f97316' // orange - expensive
    return '#ef4444' // red - very expensive
  }

  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange(subMonths(currentDate, 1))}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-slate-100">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => handleMonthChange(addMonths(currentDate, 1))}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          →
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-slate-400 text-xs font-semibold py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dateStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')
          const price = prices[dateStr]
          const isSelected = selectedDate === dateStr
          const hasPrice = price && price > 0

          const bgColor = hasPrice ? getPriceColor(price) : 'transparent'

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect?.(dateStr)}
              disabled={!hasPrice || loading}
              className={`aspect-square rounded-lg font-semibold text-sm transition-all duration-200 flex flex-col items-center justify-center ${
                isSelected ? 'ring-4 ring-blue-400' : ''
              } ${hasPrice ? 'cursor-pointer hover:scale-110 shadow-lg' : 'cursor-not-allowed opacity-30'}`}
              style={{
                backgroundColor: bgColor,
              }}
            >
              <div className="text-white font-bold drop-shadow-lg">{day}</div>
              {hasPrice && (
                <div className="text-xs text-white font-bold drop-shadow-lg">
                  €{Math.round(price)}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="text-xs text-slate-400 mb-3 font-semibold">Price Range</div>
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {[
            { color: '#10b981', label: 'Very Cheap' },
            { color: '#84cc16', label: 'Cheap' },
            { color: '#eab308', label: 'Medium' },
            { color: '#f97316', label: 'Expensive' },
            { color: '#ef4444', label: 'Very Expensive' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
