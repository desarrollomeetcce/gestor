import { prisma } from '@/lib/prisma';
import UsersPage from './components/users-view';


export default async function UsersPageContainer() {
    const users = await prisma.user.findMany({
        include: { profile: true },
        orderBy: { name: 'asc' },
    });

    const profiles = await prisma.profile.findMany({
        orderBy: { name: 'asc' },
    });

    return <UsersPage initialUsers={users} allProfiles={profiles} />;
}
