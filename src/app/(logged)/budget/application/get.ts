'use server'

import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions'

export async function getAssignedWorkLogsByRange(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const startDateRaw = formData.get('startDate')
    const endDateRaw = formData.get('endDate')
    const userIds = formData.getAll('userIds')?.map((id) => Number(id))

    if (!startDateRaw || !endDateRaw || userIds.length === 0) {
      throw new Error('Parámetros incompletos')
    }

    const startDate = new Date(startDateRaw.toString())
    const endDate = new Date(endDateRaw.toString())


       
    const logs = await prisma.workLog.findMany({
      where: {
        userId: { in: userIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ userId: 'asc' }, { date: 'asc' }],
      select: {
        id: true,
        userId: true,
        date: true,
        hours: true,
        costPerHour: true,
        paid: true,
        description: true,
      },
    })
    
    return logs
  })
}
