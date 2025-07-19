'use server'
import { prisma } from '@/lib/prisma'
import BudgetView from './components/budget-view'


export default async function Budget() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: { name: 'asc' }
    })

    return (

        <BudgetView users={users} />

    )
}
