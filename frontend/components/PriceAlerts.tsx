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
          className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                🎉 Price Drop Alert!
              </h3>
              <p className="text-slate-300 mb-2">
                {alert.flight.origin} → {alert.flight.destination}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Airline:</span>
                  <p className="text-yellow-300 font-semibold">{alert.flight.airline}</p>
                </div>
                <div>
                  <span className="text-slate-400">Current:</span>
                  <p className="text-green-400 font-semibold">€{alert.current_price}</p>
                </div>
                <div>
                  <span className="text-slate-400">Threshold:</span>
                  <p className="text-slate-300 font-semibold">€{alert.threshold}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
