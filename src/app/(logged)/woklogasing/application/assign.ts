'use server'

import { prisma } from '@/lib/prisma'
import { withActionWrapper } from '@/utils/actions'

export async function assignMultipleWorkLogsAction(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const userIds = formData.getAll('userIds').map(Number)
    const start = new Date(formData.get('startDate')!.toString())
    const end = new Date(formData.get('endDate')!.toString())
    const hours = parseFloat(formData.get('hours')?.toString() || '0')
    const description = formData.get('description')?.toString() || ''
    const costPerHour = parseFloat(formData.get('costPerHour')?.toString() || '0')

    if (!userIds.length || isNaN(hours) || !start || !end) {
      throw new Error('Datos incompletos')
    }

    const days: Date[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }

    for (const userId of userIds) {
      for (const date of days) {
        await prisma.workLog.upsert({
          where: {
            userId_date: {
              userId,
              date,
            },
          },
          update: {
            hours,
            description,
            costPerHour,
            totalCost: hours * costPerHour,
            assignedBy: 1, // puedes reemplazar con user actual si tienes auth
          },
          create: {
            userId,
            date,
            hours,
            description,
            costPerHour,
            totalCost: hours * costPerHour,
            assignedBy: 1,
          },
        })
      }
    }

    return { message: 'Horas asignadas correctamente' }
  })
}
