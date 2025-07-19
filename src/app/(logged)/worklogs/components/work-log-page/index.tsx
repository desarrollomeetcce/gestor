'use client'

import { useState } from 'react'
import WorkLogCalendarForm from '../work-log-calendar'
import AssignedWorkLogPanel from '../asigned-work-panel'

export default function WorkLogPage({ userId }: { userId: number }) {
    const [visibleMonth, setVisibleMonth] = useState(new Date()) // ← este es el mes que se ve en el calendario

    return (
        <div className="flex justify-center mt-8">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 px-4">
                <div className="md:w-2/3">
                    <WorkLogCalendarForm userId={userId} onMonthChange={setVisibleMonth} />
                </div>
                <div className="md:w-1/3">
                    <AssignedWorkLogPanel userId={userId} month={visibleMonth.getMonth() + 1} year={visibleMonth.getFullYear()} />
                </div>
            </div>
        </div>

    )
}
