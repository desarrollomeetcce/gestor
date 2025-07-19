'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { getAssignedWorkLogsByMonth } from '@/app/(logged)/worklogs/application/getHours'
import { updateWorkLogGroupAction } from '@/app/(logged)/worklogs/application/updateHours'

import MultiselectSearch from '@/shared/multiselect-search'
import { formatCurrency } from '@/utils/actions'
import { deleteWorkLogGroupAction } from '../../application/delete'

interface Props {
    users: { id: number; name: string }[]
}

interface WorkLog {
    id: number
    date: string
    hours: number
    description: string | null
    paid: boolean
    costPerHour: number | null
}

export default function ReviewerPanel({ users }: Props) {
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [logs, setLogs] = useState<WorkLog[]>([])
    const [grouped, setGrouped] = useState<any[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([users[0]?.id])

    useEffect(() => {
        async function load() {
            const allLogs: any[] = []
            for (const uid of selectedIds) {
                const res = await getAssignedWorkLogsByMonth(uid, year, month)
                if (res.status === 'success' && res.data) allLogs.push(...res.data)
            }
            setLogs(allLogs)
        }
        load()
    }, [selectedIds, year, month])

    useEffect(() => {
        const result = groupWorkLogs(logs)
        setGrouped(result)
    }, [logs])

    const handleSave = async (groupIdx: number) => {
        const group = grouped[groupIdx]
        const form = new FormData()
        group.ids.forEach((id: number) => form.append('ids', id.toString()))
        form.append('description', group.description)
        form.append('costPerHour', group.costPerHour.toString())
        form.append('paid', 'true')
        const res = await updateWorkLogGroupAction(null,form)
        alert(res.message)
    }

    const handleDelete = async (groupIdx: number) => {
        const group = grouped[groupIdx]
        const form = new FormData()
        group.ids.forEach((id: number) => form.append('ids', id.toString()))
        const res = await deleteWorkLogGroupAction(null, form)
        alert(res.message)

        // Opcional: recarga los logs luego de eliminar
        setLogs((prev) => prev.filter((log) => !group.ids.includes(log.id)))
    }

    const userSummaries = getUserSummaries(users, logs, selectedIds)

    return (
        <div className="flex gap-6 p-4 max-w-7xl mx-auto">
            <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-semibold text-white">Panel de revisión</h2>

                <div className="flex gap-4 items-center flex-wrap">
                    <div className="w-full max-w-md">
                        <MultiselectSearch
                            options={users.map((u) => ({ id: u.id, label: u.name }))}
                            selected={selectedIds}
                            onChange={setSelectedIds}
                            placeholder="Selecciona usuarios"
                        />
                    </div>

                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="px-2 py-1 rounded bg-slate-700 text-white"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-24 px-2 py-1 rounded bg-slate-700 text-white"
                    />

                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={async () => {
                            const aprobables = grouped.filter((g) => g.costPerHour > 0)

                            for (const group of aprobables) {
                                const form = new FormData()
                                group.ids.forEach((id: any) => form.append('ids', id.toString()))
                                form.append('description', group.description)
                                form.append('costPerHour', group.costPerHour.toString())
                                form.append('paid', 'true')
                                await updateWorkLogGroupAction(null,form)
                            }

                            alert('Todos los grupos con costo > 0 fueron aprobados.')
                        }}
                    >
                        ✅ Aprobar todos
                    </button>
                </div>

                {grouped.map((g, idx) => (
                    <div key={idx} className="p-4 bg-slate-800 rounded shadow space-y-2">
                        <p className="text-white text-sm font-medium">
                            📅 {format(g.from, 'dd MMM')} - {format(g.to, 'dd MMM')}
                        </p>
                        <p className="text-white text-sm">🕒 {g.totalHours} horas</p>

                        <div>
                            <label className="text-sm text-white block mb-1">💸 Costo por hora</label>
                            <input
                                type="number"
                                className="w-full rounded bg-slate-700 text-white p-2"
                                value={isNaN(g.costPerHour) ? '' : g.costPerHour}
                                onChange={(e) => {
                                    const updated = [...grouped]
                                    updated[idx].costPerHour = e.target.value === '' ? 0 : parseFloat(e.target.value)
                                    setGrouped(updated)
                                    const updatedLogs = logs.map(log =>
                                        updated[idx].ids.includes(log.id)
                                            ? { ...log, costPerHour: updated[idx].costPerHour }
                                            : log
                                    );
                                    setLogs(updatedLogs);
                                }}
                                placeholder="Ej. 150"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white block mb-1">📝 Descripción</label>
                            <input
                                type="text"
                                className="w-full rounded bg-slate-700 text-white p-2"
                                value={g.description}
                                onChange={(e) => {
                                    const updated = [...grouped]
                                    updated[idx].description = e.target.value
                                    setGrouped(updated)
                                }}
                                placeholder="Descripción del trabajo"
                            />
                        </div>

                        <p className="text-white">
                            💵 Total: <strong>{formatCurrency(g.totalHours * g.costPerHour)}</strong>
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSave(idx)}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                            >
                                Aprobar
                            </button>
                            <button
                                onClick={() => handleDelete(idx)}
                                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-80 shrink-0 bg-slate-900 p-4 rounded shadow-lg space-y-4 h-fit sticky top-4">
                <h3 className="text-lg font-semibold text-white mb-2">Resumen por usuario</h3>
                {userSummaries.map((s, idx) => (
                    <div key={idx} className="text-sm text-white border-b border-slate-700 pb-2">
                        <p className="font-medium text-blue-300">{s.name}</p>
                        <p>Horas: <strong>{s.hours}</strong></p>
                        <p>Total: <strong className="text-green-400">{formatCurrency(s.total)}</strong></p>
                    </div>
                ))}

                <hr className="border-slate-700" />
                <p className="text-white font-bold text-right">
                    Total general:{' '}
                    <span className="text-green-400">
                        {formatCurrency(userSummaries.reduce((acc, u) => acc + u.total, 0))}
                    </span>
                </p>
            </div>
        </div>
    )
}

function groupWorkLogs(logs: WorkLog[]) {
    if (!logs.length) return []
    const result: any[] = []
    let temp = {
        ids: [logs[0].id],
        from: new Date(logs[0].date),
        to: new Date(logs[0].date),
        totalHours: logs[0].hours,
        description: logs[0].description ?? '',
        costPerHour: logs[0].costPerHour ?? 0,
        paid: logs[0].paid
    }

    for (let i = 1; i < logs.length; i++) {
        const curr = logs[i]
        const currDate = new Date(curr.date)
        const prevDate = new Date(temp.to)
        prevDate.setDate(prevDate.getDate() + 1)

        const isSameGroup =
            curr.description === temp.description &&
            curr.paid === temp.paid &&
            (curr.costPerHour ?? 0) === temp.costPerHour &&
            currDate.toDateString() === prevDate.toDateString()

        if (isSameGroup) {
            temp.to = currDate
            temp.totalHours += curr.hours
            temp.ids.push(curr.id)
        } else {
            result.push({ ...temp })
            temp = {
                ids: [curr.id],
                from: currDate,
                to: currDate,
                totalHours: curr.hours,
                description: curr.description ?? '',
                costPerHour: curr.costPerHour ?? 0,
                paid: curr.paid
            }
        }
    }

    result.push({ ...temp })
    return result
}

function getUserSummaries(users: { id: number; name: string }[], logs: WorkLog[], selectedIds: number[]) {
    return users.filter((u) => selectedIds.includes(u.id)).map((user) => {
        const userLogs = logs.filter((log: any) => log.userId === user.id && (log.costPerHour ?? 0) > 0)
        const hours = userLogs.reduce((sum, log) => sum + log.hours, 0)
        const total = userLogs.reduce((sum, log) => sum + (log.hours * (log.costPerHour ?? 0)), 0)
        return { userId: user.id, name: user.name, hours, total }
    })
}
