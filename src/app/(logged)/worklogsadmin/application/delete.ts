'use server'

import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions'

export async function deleteWorkLogGroupAction(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const ids = formData.getAll('ids') as string[]

    if (ids.length === 0) throw new Error('No se proporcionaron IDs')

    const numericIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id))

    await prisma.workLog.deleteMany({
      where: {
        id: {
          in: numericIds,
        },
      },
    })

    return { status: 'success', message: 'Registros eliminados correctamente' }
  })
}
