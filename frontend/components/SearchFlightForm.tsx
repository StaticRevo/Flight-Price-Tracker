import { useState } from 'react'
import axios from 'axios'

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
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setError('')

    try {
      const response = await axios.post(`${API_BASE}/flights/search`, {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: departureDate,
        return_date: returnDate,
      })
      setSearchResults(response.data.flights)
      setSelectedFlight(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search flights')
    } finally {
      setSearching(false)
    }
  }

  const handleAddFlight = async (flight: Flight) => {
    if (!threshold) {
      setError('Please enter a threshold price')
      return
    }

    onFlightAdded({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departure_date: departureDate,
      return_date: returnDate,
      threshold: parseFloat(threshold),
      airline: flight.airline,
    })

    setOrigin('')
    setDestination('')
    setDepartureDate('')
    setReturnDate('')
    setThreshold('')
    setSearchResults([])
  }

  return (
    <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Add New Flight</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Origin (e.g., MLA)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
            required
          />
          <input
            type="text"
            placeholder="Destination (e.g., DUB)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
            required
          />
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            required
          />
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            required
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={searching || loading}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition"
        >
          {searching ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-100">Select Flight & Set Threshold</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((flight, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFlight(flight)}
                className={`p-4 border rounded-lg text-left transition ${
                  selectedFlight?.airline === flight.airline && selectedFlight?.price === flight.price
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-slate-800/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold text-slate-100">{flight.airline}</div>
                <div className="text-lg text-blue-400">€{flight.price}</div>
              </button>
            ))}
          </div>

          {selectedFlight && (
            <div className="flex gap-3 mt-4">
              <input
                type="number"
                step="0.01"
                placeholder="Alert threshold (€)"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
              />
              <button
                onClick={() => handleAddFlight(selectedFlight)}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                {loading ? 'Adding...' : 'Add to Watchlist'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
