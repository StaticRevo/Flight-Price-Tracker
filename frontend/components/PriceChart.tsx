import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PriceData {
  [date: string]: number
}

interface PriceChartProps {
  prices: PriceData
  loading?: boolean
}

export default function PriceChart({ prices, loading = false }: PriceChartProps) {
  const chartData = Object.entries(prices)
    .filter(([_, price]) => price > 0)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, price]) => ({
      date,
      price: Math.round(price),
      displayDate: date.slice(5), // MM-DD
    }))

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-slate-400">
        {loading ? 'Loading price data...' : 'No price data available'}
      </div>
    )
  }

  const minPrice = Math.min(...chartData.map((d) => d.price))
  const maxPrice = Math.max(...chartData.map((d) => d.price))
  const avgPrice = Math.round(chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length)

  return (
    <div className="w-full">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="text-xs text-green-400 mb-1">Cheapest</div>
          <div className="text-xl font-bold text-green-400">€{minPrice}</div>
        </div>
        <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="text-xs text-yellow-400 mb-1">Average</div>
          <div className="text-xl font-bold text-yellow-400">€{avgPrice}</div>
        </div>
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="text-xs text-red-400 mb-1">Most Expensive</div>
          <div className="text-xl font-bold text-red-400">€{maxPrice}</div>
        </div>
      </div>

      <div className="w-full h-64 bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="displayDate"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              cursor={{ stroke: '#64748b', strokeWidth: 2 }}
              formatter={(value: number) => [`€${value}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 5 }}
              activeDot={{ r: 7, fill: '#0891b2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
