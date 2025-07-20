import { getUserFromCookie } from "@/app/lib/auth";
import Navbar from "@/app/shared/nav-bar";
import { prisma } from '@/app/lib/prisma'

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUserFromCookie();
    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        include: {
            profile: {
                include: { permissions: true },
            },
        },
    });

    const permissions = dbUser?.profile?.permissions.map((p: any) => p.name) ?? [];

    return (
        <div>
            <Navbar permissions={permissions} userName={user.name} />
            <div className="min-h-screen p-8 bg-slate-900 text-white">
                {children}
            </div>

        </div>
    );
}
