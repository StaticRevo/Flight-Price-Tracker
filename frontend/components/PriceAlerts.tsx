interface Alert {
  index: number
  flight: {
    origin: string
    destination: string
    airline: string
    departure_date: string
    return_date: string
  }
  current_price: number
  threshold: number
}

interface PriceAlertsProps {
  alerts: Alert[]
}

export default function PriceAlerts({ alerts }: PriceAlertsProps) {
  return (
    <div className="mb-6 space-y-3">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="p-4 bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-red-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm shadow-lg shadow-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 animate-in fade-in"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <span className="text-xl animate-float">🎉</span>
                Price Drop Alert!
              </h3>
              <p className="text-slate-300 mb-3 font-medium">
                {alert.flight.origin} → {alert.flight.destination}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-400 block mb-1">Airline:</span>
                  <p className="text-yellow-300 font-bold">{alert.flight.airline}</p>
                </div>
                <div className="p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-400 block mb-1">Current Price:</span>
                  <p className="text-green-400 font-bold">€{alert.current_price}</p>
                </div>
                <div className="p-2 bg-slate-800/30 rounded">
                  <span className="text-slate-400 block mb-1">Your Threshold:</span>
                  <p className="text-slate-300 font-bold">€{alert.threshold}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
