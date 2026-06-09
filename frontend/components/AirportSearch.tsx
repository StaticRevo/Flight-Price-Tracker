import { useState, useRef, useEffect } from 'react'
import airports from '@/data/airports.json'

interface Airport {
  code: string
  city: string
  country: string
  name: string
}

interface AirportSearchProps {
  value: string
  onChange: (code: string) => void
  placeholder?: string
}

export default function AirportSearch({ value, onChange, placeholder = 'Search airport...' }: AirportSearchProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value) {
      const airport = airports.find((a) => a.code === value)
      if (airport) {
        setInput(`${airport.code} - ${airport.city}, ${airport.country}`)
      }
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value
    setInput(search)
    setHighlightedIndex(-1)

    if (search.length === 0) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = airports.filter((airport) => {
      return (
        airport.code.toLowerCase().includes(searchLower) ||
        airport.city.toLowerCase().includes(searchLower) ||
        airport.country.toLowerCase().includes(searchLower)
      )
    })

    setSuggestions(filtered.slice(0, 10))
    setIsOpen(filtered.length > 0)
  }

  const handleSelect = (airport: Airport) => {
    setInput(`${airport.code} - ${airport.city}, ${airport.country}`)
    onChange(airport.code)
    setIsOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => input.length > 0 && suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-slate-500 transition-all"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl shadow-slate-900/50 z-10 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {suggestions.map((airport, index) => (
            <button
              key={`${airport.code}-${index}`}
              onClick={() => handleSelect(airport)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-2 ${
                highlightedIndex === index
                  ? 'bg-slate-700 border-l-cyan-500'
                  : 'border-l-transparent hover:bg-slate-700/50'
              }`}
            >
              <div className="font-semibold text-cyan-400 text-sm">{airport.code}</div>
              <div className="text-sm text-slate-300">{airport.city}, {airport.country}</div>
              <div className="text-xs text-slate-500 mt-1">{airport.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
