'use client'

import { useState } from 'react'

import MultiselectSearch from '@/shared/multiselect-search'
import { assignMultipleWorkLogsAction } from '../../application/assign'

export default function AssignWorkLogsPanel({ users }: { users: { id: number, name: string }[] }) {
  const [userIds, setUserIds] = useState<number[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')
  const [costPerHour, setCostPerHour] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleAssign = async () => {
    const form = new FormData()
    userIds.forEach(id => form.append('userIds', id.toString()))
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    form.append('hours', hours)
    form.append('description', description)
    form.append('costPerHour', costPerHour)

    const res = await assignMultipleWorkLogsAction(null, form)
    setStatus(res.message)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-slate-800 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold text-white">Asignar horas por rango</h2>

      <MultiselectSearch
        options={users.map(u => ({ id: u.id, label: u.name }))}
        selected={userIds}
        onChange={setUserIds}
        placeholder="Selecciona usuarios"
      />

      <div className="flex gap-4">
        <input
          type="date"
          className="bg-slate-700 text-white p-2 rounded"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="bg-slate-700 text-white p-2 rounded"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <input
        type="number"
        className="bg-slate-700 text-white p-2 w-full rounded"
        placeholder="Horas por día"
        value={hours}
        onChange={e => setHours(e.target.value)}
      />

      <input
        type="number"
        className="bg-slate-700 text-white p-2 w-full rounded"
        placeholder="Costo por hora"
        value={costPerHour}
        onChange={e => setCostPerHour(e.target.value)}
      />

      <input
        type="text"
        className="bg-slate-700 text-white p-2 w-full rounded"
        placeholder="Comentario"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Asignar
      </button>

      {status && <p className="text-green-400">{status}</p>}
    </div>
  )
}
