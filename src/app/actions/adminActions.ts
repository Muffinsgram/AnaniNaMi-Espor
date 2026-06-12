"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendDiscordLog } from "@/lib/discordLogger";
import { getServerSession } from "next-auth";

async function getAdminData() {
    try {
        const session = await getServerSession();
        return {
            name: session?.user?.name || "Bilinmeyen Yetkili",
            image: session?.user?.image || undefined
        };
    } catch {
        return { name: "Sistem Yetkilisi", image: undefined };
    }
}

// Oyuncunun rolünü değiştirme
export async function togglePlayerRole(userId: string, currentRole: string) {
    try {
        const newRole = currentRole === "OYUNCU" ? "ÜYE" : "OYUNCU";

        // Kimin rolünün değiştiğini bilmek için oyuncuyu buluyoruz
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });

        await prisma.user.update({
            where: { id: userId },
            data: { teamRole: newRole },
        });

        // 🚨 DISCORD GİZLİ LOG (Kadro Değişikliği)
        if (targetUser) {
            const admin = await getAdminData();
            const isPromoted = newRole === "OYUNCU";

            await sendDiscordLog({
                module: "ROSTER",
                title: isPromoted ? "🎯 Yeni Oyuncu As Kadroda!" : "⚠️ Oyuncu Kadrodan Çıkarıldı",
                description: `**${targetUser.name}** (${targetUser.riotId || 'Riot ID Yok'}) adlı kişinin takım durumu güncellendi.`,
                type: isPromoted ? "SUCCESS" : "WARNING",
                fields: [
                    { name: "Eski Durum", value: currentRole === "OYUNCU" ? "Kadroda" : "Bekliyor", inline: true },
                    { name: "Yeni Durum", value: isPromoted ? "Kadroda" : "Bekliyor", inline: true }
                ],
                thumbnailUrl: targetUser.image || undefined,
                isPublic: false,
                adminName: admin.name,
                adminImage: admin.image
            });
        }

        revalidatePath("/admin");
        revalidatePath("/kadro");
        return { success: true, newRole };
    } catch (error) {
        console.error("Rol değiştirme hatası:", error);
        return { error: "İşlem sırasında bir hata oluştu." };
    }
}