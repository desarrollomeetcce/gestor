// app/actions/worklog.ts
'use server'

import { prisma } from '@/lib/prisma'
import { withActionWrapper } from '@/utils/actions'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getAssignedWorkLogsByMonth(userId: number, year: number, month: number) {
    return withActionWrapper(async () => {
       
        const date = new Date(year, month - 1, 1) // ← ¡ESTO está bien!
        const start = startOfMonth(date)
        const end = endOfMonth(date)
       
        const logs = await prisma.workLog.findMany({
            where: {
                userId,
                date: { gte: start, lte: end }
            },
            orderBy: { date: 'asc' }
        })
       
        return logs
    })
}
