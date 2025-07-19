'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, eachDayOfInterval } from 'date-fns'
import type { DateRange } from 'react-day-picker'

import 'react-day-picker/dist/style.css';
import { createWorkLogsAction } from '../../application/addHours'


interface Props {
    userId: number
    onMonthChange?: (date: Date) => void
}

export default function WorkLogCalendarForm({ userId, onMonthChange }: Props) {
    const [range, setRange] = useState<DateRange | undefined>()
    const [hours, setHours] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!range?.from || !range?.to) {
            setStatus('Selecciona un rango válido')
            return
        }

        const dates = eachDayOfInterval({ start: range.from, end: range.to }).map(date =>
            format(date, 'yyyy-MM-dd')
        )

        const formData = new FormData()
        formData.append('userId', userId.toString())
        formData.append('hours', hours)
        formData.append('description', description)
        dates.forEach(date => formData.append('dates', date))

        const res = await createWorkLogsAction(null, formData)
        setStatus(res.message)
        setRange(undefined)
        setHours('')
        setDescription('')
    }

    return (
        <div className="bg-slate-900 p-4 rounded-lg shadow-md border border-slate-700">
            <h2 className="text-2xl font-semibold text-black dark:text-white">Registrar horas trabajadas</h2>

            <div>
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    classNames={{
                        months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4',
                        month: 'space-y-4 text-black dark:text-white',
                        caption: 'flex justify-center pt-1 relative items-center',
                        nav: 'space-x-1 flex items-center',
                        nav_button: 'text-black dark:text-white',
                        table: 'w-full border-collapse space-y-1',
                        head_row: 'flex',
                        head_cell: 'w-9 font-normal text-sm text-center text-gray-500 dark:text-gray-400',
                        row: 'flex w-full mt-2',
                        cell: 'w-9 h-9 text-center text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center',
                        day_selected: 'bg-blue-600 text-white',
                        day_today: 'border border-blue-500',
                        day_disabled: 'text-gray-400',
                        day_outside: 'text-gray-400 dark:text-gray-600',
                    }}
                    onMonthChange={(month) => {
                        onMonthChange?.(month)
                    }}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-black dark:text-white">Horas por día</label>
                <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-black dark:text-white"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-black dark:text-white">Descripción</label>
                <textarea
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-black dark:text-white"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleSubmit}
            >
                Registrar horas
            </button>

            {status && <p className="text-green-500 dark:text-green-400">{status}</p>}
        </div>
    )
}
