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
    <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-100">Watched Flights</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No flights being tracked. Add one to get started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Route</th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Dates</th>
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Airline</th>
                <th className="text-right py-3 px-4 text-slate-300 font-semibold">Threshold</th>
                <th className="text-center py-3 px-4 text-slate-300 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((flight, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-blue-400">{flight.origin} → {flight.destination}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="text-xs">{flight.departure_date}</div>
                    <div className="text-xs">to {flight.return_date}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{flight.airline}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold">
                      €{flight.threshold}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onRemove(idx)}
                      className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs font-semibold transition"
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
