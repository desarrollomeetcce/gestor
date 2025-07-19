'use client'

import { useEffect, useState } from 'react'

import { format } from 'date-fns'
import { getAssignedWorkLogsByMonth } from '../../application/getHours'

interface Props {
  userId: number
  month: number
  year: number
}

interface WorkLog {
  id: number
  date: string
  hours: number
  description: string | null
  paid: boolean
}

export default function AssignedWorkLogPanel({ userId, month, year }: Props) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await getAssignedWorkLogsByMonth(userId, year, month)
      if (res.status === 'success' && res.data) {
        setLogs(res.data)
      }
      setLoading(false)
    }
    load()
  }, [userId, month, year])

  const grouped = groupWorkLogs(logs)

  return (
    <div className="bg-slate-900 p-4 rounded-lg shadow-md border border-slate-700">
      <h3 className="text-lg font-semibold text-black dark:text-white">Horas asignadas</h3>

      {loading && <p className="text-sm text-gray-400">Cargando...</p>}
      {!loading && grouped.length === 0 && (
        <p className="text-sm text-gray-500">No hay asignaciones este mes.</p>
      )}

      {grouped.map((g, i) => (
        <div
          key={i}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-slate-100 dark:bg-slate-700"
        >
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            📅 {g.from === g.to
              ? format(g.from, 'dd MMM yyyy')
              : `${format(g.from, 'dd MMM')} - ${format(g.to, 'dd MMM')}`}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">🕒 {g.totalHours} horas</p>
          {g.description && (
            <p className="text-sm italic text-gray-600 dark:text-gray-300">🧾 {g.description}</p>
          )}
          <p className={`mt-1 text-sm font-bold ${g.paid ? 'text-green-500' : 'text-yellow-400'}`}>
            {g.paid ? '✅ Aprobado' : '⏳ Pendiente'}
          </p>
        </div>
      ))}
    </div>
  )
}

function groupWorkLogs(logs: WorkLog[]) {
  if (!logs.length) return []

  const result: {
    from: Date
    to: Date
    totalHours: number
    description: string | null
    paid: boolean
  }[] = []

  let group = {
    from: new Date(logs[0].date),
    to: new Date(logs[0].date),
    totalHours: logs[0].hours,
    description: logs[0].description,
    paid: logs[0].paid,
  }

  for (let i = 1; i < logs.length; i++) {
    const curr = logs[i]
    const currDate = new Date(curr.date)
    const prevDate = new Date(group.to)
    prevDate.setDate(prevDate.getDate() + 1)

    const isSameGroup =
      curr.description === group.description &&
      curr.paid === group.paid &&
      currDate.toDateString() === prevDate.toDateString()

    if (isSameGroup) {
      group.to = currDate
      group.totalHours += curr.hours
    } else {
      result.push({ ...group })
      group = {
        from: currDate,
        to: currDate,
        totalHours: curr.hours,
        description: curr.description,
        paid: curr.paid,
      }
    }
  }

  result.push(group)
  return result
}
