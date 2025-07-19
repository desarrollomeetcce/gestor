import { getSessionUser } from "@/lib/auth";
import SharedLinksPage from "./components/shared-links-page";



export default async function SharedLinksServerPage() {
    const session = await getSessionUser();
    if (!session) return <p className="p-6">No has iniciado sesión.</p>;

    const [links] = await Promise.all([
        prisma.link.findMany({
            where: {
                OR: [
                    { ownerId: session.userId },
                    { users: { some: { id: session.userId } } },
                    {
                        profiles: session.profileId
                            ? { some: { id: session.profileId } }
                            : undefined,
                    },
                ],
            },
            include: {
                type: true,
                users: true,
                profiles: true,
            },
            orderBy: { id: 'desc' },
        }),
    ]);

    return <SharedLinksPage sharedLinks={links} />;
}
