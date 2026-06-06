"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
// YOLU DÜZELTTİK: Artık eski route dosyasına değil, yeni açtığımız güvenli lib dosyasına bakıyor
import { authOptions } from "@/lib/auth";

export async function updateProfile(riotId: string, agentName: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { error: "Giriş yetkisi bulunamadı. Lütfen Discord ile tekrar giriş yapın." };
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                riotId: riotId,
                favoriteAgent: agentName,
                isTrackerLinked: true,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Kayıt Hatası:", error);
        return { error: "Veritabanına kaydedilirken bir hata oluştu." };
    }
}