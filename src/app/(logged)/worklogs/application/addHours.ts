'use server'

import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions'
import { revalidatePath } from 'next/cache'

export async function createWorkLogsAction(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const userId = Number(formData.get('userId'))
    const hours = parseFloat(formData.get('hours')?.toString() || '0')
    const description = formData.get('description')?.toString() || ''
    const datesRaw = formData.getAll('dates') as string[]

    if (!userId || !hours || datesRaw.length === 0) {
      throw new Error('Datos incompletos')
    }

    for (const date of datesRaw) {
      const parsedDate = new Date(date)

      await prisma.workLog.upsert({
        where: {
          userId_date: {
            userId,
            date: parsedDate,
          },
        },
        update: {
          hours,
          description,
        },
        create: {
          userId,
          date: parsedDate,
          hours,
          description,
        },
      })
    }

    revalidatePath("worklogs");
    return { message: 'Horas registradas o actualizadas correctamente' }
  })
}
