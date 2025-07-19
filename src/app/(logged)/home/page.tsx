import { getUserFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export default async function Home() {
    const user = await getUserFromCookie();
    if (!user) return null;
    const logs = await prisma.workLog.findMany({
        where: { userId: user.userId },
        orderBy: { date: 'desc' },
        take: 5,
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

            <section className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">Bienvenido, {user.name} 👋</h1>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur">
                    <h2 className="text-xl font-medium mb-2">Tus últimas horas registradas</h2>
                    {logs.length > 0 ? (
                        <ul className="space-y-2 text-white/90 text-sm">
                            {logs.map((log) => (
                                <li key={log.id}>
                                    <strong>{log.date.toLocaleDateString()}</strong> — {log.hours} horas
                                    {log.description && ` (${log.description})`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white/70">No has registrado horas recientemente.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
