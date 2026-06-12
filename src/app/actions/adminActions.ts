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

// Oyuncunun unvanını doğrudan günceller (KAPTAN, KOÇ, OYUNCU, YEDEK vb.)
export async function updatePlayerRole(userId: string, newRole: string) {
    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) return { error: "Kullanıcı bulunamadı." };

        const oldRole = targetUser.teamRole || "ÜYE";

        await prisma.user.update({
            where: { id: userId },
            data: { teamRole: newRole },
        });

        // 🚨 DISCORD GİZLİ LOG (Scout Ekibi Unvan Güncelleme Raporu)
        const admin = await getAdminData();
        await sendDiscordLog({
            module: "ROSTER",
            title: `🎯 Kadro Unvanı Güncellendi: ${targetUser.name}`,
            description: `**${targetUser.name}** adlı kullanıcının takımdaki unvanı değiştirildi.`,
            type: "SUCCESS",
            fields: [
                { name: "Eski Unvan", value: oldRole, inline: true },
                { name: "Yeni Unvan", value: newRole, inline: true }
            ],
            thumbnailUrl: targetUser.image || undefined,
            isPublic: false,
            adminName: admin.name,
            adminImage: admin.image
        });

        revalidatePath("/admin");
        revalidatePath("/kadro");

        return { success: true };
    } catch (error) {
        console.error("Rol güncelleme hatası:", error);
        return { error: "İşlem sırasında bir hata oluştu." };
    }
}