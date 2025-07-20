// app/(logged)/profiles/actions.ts
'use server'
import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions'

export const createProfileAction = async (_: any, formData: FormData) => {
  return withActionWrapper(async () => {
    const name = formData.get('name')?.toString() || ''
    const rate = parseFloat(formData.get('defaultRate')?.toString() || '0')
    const permissionIds = formData.getAll('permissionIds').map(id => parseInt(id.toString())).filter(id => !isNaN(id))
    if (!name || isNaN(rate)) throw new Error('Datos incompletos')
    await prisma.profile.create({
      data: {
        name,
        defaultRate: rate,
        permissions: {
          connect: permissionIds.map(id => ({ id }))
        }
      }
    })
    return { status: 'success', message: 'Perfil creado' }
  })
}

export const updateProfileAction = async (_: any, formData: FormData) => {
  return withActionWrapper(async () => {
    const id = parseInt(formData.get('id')?.toString() || '')
    const name = formData.get('name')?.toString() || ''
    const rate = parseFloat(formData.get('defaultRate')?.toString() || '0')
    const permissionIds = formData.getAll('permissionIds').map(id => parseInt(id.toString())).filter(id => !isNaN(id))
    if (!id || !name || isNaN(rate)) throw new Error('Datos incompletos')
    await prisma.profile.update({
      where: { id },
      data: {
        name,
        defaultRate: rate,
        permissions: {
          set: permissionIds.map(id => ({ id }))
        }
      }
    })
    return { status: 'success', message: 'Perfil actualizado' }
  })
}

export const deleteProfileAction = async (id: number) => {
  return withActionWrapper(async () => {
    await prisma.profile.delete({ where: { id } })
    return { status: 'success', message: 'Perfil eliminado' }
  })
}
