// file: updateWorkLogGroupAction.ts
'use server'

import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions'
import { getSessionUser } from '@/app/lib/auth' // Asegúrate de tener esto
import { revalidatePath } from 'next/cache'

export async function updateWorkLogGroupAction(_: any, formData: FormData) {
    return withActionWrapper(async () => {
        const ids = formData.getAll('ids') as string[]
        const description = formData.get('description')?.toString() ?? ''
        const costPerHour = parseFloat(formData.get('costPerHour')?.toString() ?? '0')
        const paid = formData.get('paid') === 'true'

        const approver = await getSessionUser() // Debes tener esta función
        if (!approver?.userId) throw new Error('Usuario no autenticado')

        const updated = await prisma.workLog.updateMany({
            where: {
                id: { in: ids.map((id) => Number(id)) },
                locked: false, // Evita cambios si ya fue aprobado
            },
            data: {
                description,
                costPerHour,
                totalCost: { set: costPerHour * 1 }, // recalcula totalCost si quieres
                paid,
                approvedBy: approver.userId,
                locked: true,
            },
        })
        revalidatePath("worklogs");
        return {
            status: 'success',
            message: `${updated.count} registros actualizados y aprobados.`,
        }
    })
}
