import { useState } from 'react'
import axios from 'axios'
import AirportSearch from './AirportSearch'
import PriceExplorer from './PriceExplorer'

const API_BASE = 'http://localhost:8000/api'

interface Flight {
  airline: string
  price: number
}

interface SearchFlightFormProps {
  onFlightAdded: (flight: any) => void
  loading: boolean
}

export default function SearchFlightForm({ onFlightAdded, loading }: SearchFlightFormProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [threshold, setThreshold] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setError('')
    setSelectedFlight(null)
    setThreshold('')
    setShowCalendar(false)

    try {
      const response = await axios.post(`${API_BASE}/flights/search`, {
        origin: origin,
        destination: destination,
        departure_date: departureDate,
        return_date: returnDate,
      })
      setSearchResults(response.data.flights)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search flights')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowCalendar(false)
    setThreshold('')
  }

  const handleAddFlight = async () => {
    if (!threshold) {
      setError('Please enter a threshold price')
      return
    }

    if (!selectedFlight) {
      setError('Please select a flight')
      return
    }

    onFlightAdded({
      origin: origin,
      destination: destination,
      departure_date: departureDate,
      return_date: returnDate,
      threshold: parseFloat(threshold),
      airline: selectedFlight.airline,
    })

    setOrigin('')
    setDestination('')
    setDepartureDate('')
    setReturnDate('')
    setThreshold('')
    setSearchResults([])
    setSelectedFlight(null)
    setShowCalendar(false)
  }

  return (
    <div className="mb-8 p-6 bg-slate-900 border border-slate-700 rounded-lg backdrop-blur-sm shadow-lg shadow-slate-900/50 transition-all duration-300 hover:border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          ✈️ Add New Flight
        </h2>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-300">
          <strong>📌 How it works:</strong> Enter where you're departing FROM and where you want to go TO, plus your outbound and return dates. The calendar will show prices for flights on those dates.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-cyan-400 mb-2 block uppercase tracking-wider">FROM (Origin Airport)</label>
            <AirportSearch
              value={origin}
              onChange={setOrigin}
              placeholder="Where are you departing from?"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-400 mb-2 block uppercase tracking-wider">TO (Destination Airport)</label>
            <AirportSearch
              value={destination}
              onChange={setDestination}
              placeholder="Where are you going to?"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-cyan-400 mb-2 block uppercase tracking-wider">Outbound Date (Departure)</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-400 mb-2 block uppercase tracking-wider">Return Date (Coming Back)</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm animate-in fade-in">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={searching || loading}
          className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
        >
          {searching ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Searching...
            </span>
          ) : (
            'Search Flights'
          )}
        </button>
      </form>

      {/* Flight Results */}
      {searchResults.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4 animate-in fade-in">
          <h3 className="text-lg font-semibold text-slate-100">Available Flights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((flight, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectFlight(flight)}
                className={`p-4 border rounded-lg text-left transition-all duration-300 ${
                  selectedFlight?.airline === flight.airline && selectedFlight?.price === flight.price
                    ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                    : 'bg-slate-800/30 border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <div className="font-semibold text-slate-100">{flight.airline}</div>
                <div className="text-lg text-blue-400 font-bold">€{flight.price}</div>
              </button>
            ))}
          </div>

          {/* Selected Flight Details */}
          {selectedFlight && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Selected Flight</p>
                  <p className="text-xl font-bold text-cyan-400">
                    {selectedFlight.airline} - €{selectedFlight.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    showCalendar
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  📅 {showCalendar ? 'Hide' : 'View'} Price Calendar
                </button>
              </div>

              {/* Price Calendar */}
              {showCalendar && (
                <div className="mt-4 pt-4 border-t border-cyan-500/30 animate-in fade-in">
                  <PriceExplorer
                    origin={origin}
                    destination={destination}
                    startDate={departureDate}
                    endDate={returnDate}
                  />
                </div>
              )}

              {/* Threshold Input & Add Button */}
              <div className="flex gap-3 mt-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Alert threshold (€)"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 text-white placeholder-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddFlight}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                >
                  {loading ? 'Adding...' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
