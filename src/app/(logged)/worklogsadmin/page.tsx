// app/(admin)/review/page.tsx
import { prisma } from '@/lib/prisma'
import ReviewerPanel from './components/worklog-user-panel'


export default async function ReviewerPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen bg-slate-900 py-10 px-4">
      <ReviewerPanel users={users} />
    </main>
  )
}
