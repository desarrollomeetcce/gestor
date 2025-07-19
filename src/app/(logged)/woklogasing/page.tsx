import { prisma } from '@/lib/prisma'
import AssignWorkLogsPanel from './component/assing-view'


export default async function AssignHoursPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' }
  })

  return (
    <main className="p-8">
      <AssignWorkLogsPanel users={users} />
    </main>
  )
}
