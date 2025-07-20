import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { prisma } from '@/app/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'soutbug-secret-key';

export interface AuthUser {
    userId: number;
    name: string;
}

export async function getUserFromCookie() {
    const cookiesSession = await cookies();
    const token = cookiesSession.get('session')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        return decoded;
    } catch {
        return null;
    }
}



export async function getSessionUser() {
    try {
        const cookiesSession = await cookies();
        const token = cookiesSession.get('session')?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            name: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                profileId: true,
            },
        });

        if (!user) return null;

        return {
            userId: user.id,
            name: user.name,
            profileId: user.profileId,
        };
    } catch (error) {
        return null;
    }
}
