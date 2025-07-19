'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  options: { id: number; label: string }[]
  selected: number[]
  onChange: (newSelected: number[]) => void
  placeholder?: string
}

export default function MultiselectSearch({ options, selected, onChange, placeholder }: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelection = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="bg-slate-700 text-white px-3 py-2 rounded cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0
          ? placeholder || 'Seleccionar...'
          : `${selected.length} seleccionado(s)`}
      </div>

      {open && (
        <div className="absolute z-10 mt-2 w-full bg-slate-800 border border-slate-600 rounded shadow max-h-64 overflow-auto">
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-800 text-white border-b border-slate-600 outline-none"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="max-h-48 overflow-auto">
            {filtered.map((option) => (
              <li
                key={option.id}
                className={`px-3 py-1 cursor-pointer hover:bg-blue-600 ${
                  selected.includes(option.id) ? 'bg-blue-700 text-white' : 'text-gray-300'
                }`}
                onClick={() => toggleSelection(option.id)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
