'use server'

import { getSessionUser } from "@/app/lib/auth";
import WorkLogPage from "./components/work-log-page";



export default async function LinkTypePage() {
    const session = await getSessionUser();
    if (!session) return <p className="p-6">No has iniciado sesión.</p>;

    return <WorkLogPage userId={session.userId} />
}