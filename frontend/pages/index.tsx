import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchFlightForm from '@/components/SearchFlightForm'
import WatchlistTable from '@/components/WatchlistTable'
import PriceAlerts from '@/components/PriceAlerts'

const API_BASE = 'http://localhost:8000/api'

interface Flight {
  id?: number
  origin: string
  destination: string
  departure_date: string
  return_date: string
  threshold: number
  airline: string
}

interface Alert {
  index: number
  flight: Flight
  current_price: number
  threshold: number
}

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<Flight[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWatchlist()
    checkPrices()
    const interval = setInterval(checkPrices, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const loadWatchlist = async () => {
    try {
      const response = await axios.get(`${API_BASE}/watchlist/`)
      setWatchlist(response.data.watchlist || [])
    } catch (err) {
      setError('Failed to load watchlist')
    }
  }

  const checkPrices = async () => {
    try {
      const response = await axios.get(`${API_BASE}/watchlist/check-prices`)
      setAlerts(response.data.alerts || [])
    } catch (err) {
      console.log('Could not check prices')
    }
  }

  const handleFlightAdded = async (flight: Flight) => {
    setLoading(true)
    try {
      await axios.post(`${API_BASE}/watchlist/add`, flight)
      await loadWatchlist()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add flight')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFlight = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/watchlist/${id}`)
      await loadWatchlist()
    } catch (err) {
      setError('Failed to remove flight')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl animate-float">✈️</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Flight Price Tracker
            </h1>
          </div>
          <p className="text-slate-400 ml-2">Track flights, catch deals, fly cheap ✨</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 animate-in fade-in">
            {error}
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && <PriceAlerts alerts={alerts} />}

        {/* Add Flight Form */}
        <SearchFlightForm onFlightAdded={handleFlightAdded} loading={loading} />

        {/* Watchlist */}
        <WatchlistTable
          watchlist={watchlist}
          onRemove={handleRemoveFlight}
          onRefresh={loadWatchlist}
        />
      </div>
    </div>
  )
}
