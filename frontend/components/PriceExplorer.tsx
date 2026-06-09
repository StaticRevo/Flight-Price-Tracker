import { useState, useEffect } from 'react'
import axios from 'axios'
import { format, addDays, isAfter } from 'date-fns'
import PriceCalendar from './PriceCalendar'
import PriceChart from './PriceChart'

const API_BASE = 'http://localhost:8000/api'

interface PriceExplorerProps {
  origin: string
  destination: string
  startDate: string
  endDate: string
}

export default function PriceExplorer({ origin, destination, startDate, endDate }: PriceExplorerProps) {
  const [prices, setPrices] = useState<{ [date: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(startDate)

  useEffect(() => {
    if (!origin || !destination || !startDate) return
    fetchPricesForDateRange()
  }, [origin, destination, startDate, endDate])

  const fetchPricesForDateRange = async (start?: string, end?: string) => {
    setLoading(true)
    const priceData: { [date: string]: number } = {}

    try {
      const startDateStr = start || startDate
      const endDateStr = end || (endDate || undefined)

      // Generate dates to fetch
      const dates = []
      let currentDate = new Date(startDateStr)
      const endDateObj = endDateStr ? new Date(endDateStr) : addDays(new Date(startDateStr), 30)

      while (!isAfter(currentDate, endDateObj) && dates.length < 32) {
        dates.push(format(currentDate, 'yyyy-MM-dd'))
        currentDate = addDays(currentDate, 1)
      }

      console.log(`Fetching prices for ${dates.length} dates:`, dates)

      // Fetch prices sequentially with small delays to avoid rate limiting
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i]

        // Add delay between requests
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        try {
          console.log(`Fetching price for ${date}...`)
          const response = await axios.post(`${API_BASE}/flights/search`, {
            origin,
            destination,
            departure_date: date,
            return_date: endDateStr || undefined,
          })

          console.log(`Response for ${date}:`, response.data)

          if (response.data.flights && response.data.flights.length > 0) {
            const minPrice = Math.min(...response.data.flights.map((f: any) => f.price))
            console.log(`Price for ${date}: €${minPrice}`)
            priceData[date] = minPrice
            setPrices((prev) => {
              const updated = { ...prev, [date]: minPrice }
              console.log(`Updated prices:`, updated)
              return updated
            })
          } else {
            console.log(`No flights found for ${date}`)
          }
        } catch (err) {
          console.error(`Error fetching price for ${date}:`, err)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMonthChange = (newStartDate: string, newEndDate: string) => {
    console.log(`Month changed: ${newStartDate} to ${newEndDate}`)
    fetchPricesForDateRange(newStartDate, newEndDate)
  }

  return (
    <div className="space-y-6">
      {/* Calendar Heatmap */}
      <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">📅 Price Calendar</h3>
        <PriceCalendar
          origin={origin}
          destination={destination}
          prices={prices}
          loading={loading}
          selectedDate={selectedDate}
          startDate={startDate}
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Price Chart */}
      <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">📈 Price Trends</h3>
        <PriceChart prices={prices} loading={loading} />
      </div>

      {/* Selected Date Info */}
      {selectedDate && prices[selectedDate] && (
        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-lg">
          <div className="text-sm text-slate-400 mb-1">Selected Date</div>
          <div className="text-2xl font-bold text-cyan-400">
            {format(new Date(selectedDate), 'MMMM d, yyyy')} - €{Math.round(prices[selectedDate])}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-6 text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-2"></div>
          <p>Fetching prices for available dates...</p>
        </div>
      )}
    </div>
  )
}
