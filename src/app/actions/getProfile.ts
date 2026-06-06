"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function getProfile() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                riotId: true,
                favoriteAgent: true,
                isTrackerLinked: true
            }
        });

        return user;
    } catch (error) {
        console.error("Profil Çekme Hatası:", error);
        return null;
    }
}