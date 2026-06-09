interface Flight {
  id?: number
  origin: string
  destination: string
  departure_date: string
  return_date: string
  threshold: number
  airline: string
}

interface WatchlistTableProps {
  watchlist: Flight[]
  onRemove: (id: number) => void
  onRefresh: () => void
}

export default function WatchlistTable({ watchlist, onRemove, onRefresh }: WatchlistTableProps) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-700 rounded-lg backdrop-blur-sm shadow-lg shadow-slate-900/50 transition-all duration-300 hover:border-slate-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          👁️ Watched Flights
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition-all duration-300 text-sm font-semibold border border-slate-600"
        >
          🔄 Refresh
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <p>No flights being tracked yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-cyan-400 font-semibold uppercase text-xs">Route</th>
                <th className="text-left py-3 px-4 text-cyan-400 font-semibold uppercase text-xs">Dates</th>
                <th className="text-left py-3 px-4 text-cyan-400 font-semibold uppercase text-xs">Airline</th>
                <th className="text-right py-3 px-4 text-cyan-400 font-semibold uppercase text-xs">Threshold</th>
                <th className="text-center py-3 px-4 text-cyan-400 font-semibold uppercase text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((flight, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-all duration-300 group"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                      {flight.origin} → {flight.destination}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="text-xs">{flight.departure_date}</div>
                    <div className="text-xs">to {flight.return_date}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{flight.airline}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-3 py-1 bg-slate-800 text-green-400 rounded-full text-xs font-semibold border border-slate-600">
                      €{flight.threshold}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onRemove(idx)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg text-xs font-semibold transition-all duration-300 border border-slate-600 hover:border-red-500/30"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
