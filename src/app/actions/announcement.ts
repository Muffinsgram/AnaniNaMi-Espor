"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendDiscordLog } from "@/lib/discordLogger";

// Admin Yetki Kontrolü Yardımcı Fonksiyonu
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) throw new Error("Giriş yapılmadı!");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user?.role !== "ADMIN") throw new Error("Yetkisiz işlem!");

    return { user, session };
}

export async function getAnnouncements() {
    return await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" }
    });
}

// 1. Yeni Duyuru Ekleme
export async function createAnnouncement(data: { title: string; content: string }) {
    const { user, session } = await checkAdmin();

    await prisma.announcement.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: user.id,
        }
    });

    // 🚨 DISCORD PUBLIC BİLDİRİMİ (Yeni Duyuru Herkese Açık Gider)
    await sendDiscordLog({
        module: "SYSTEM",
        title: "📢 Yeni Sistem Duyurusu!",
        description: `**${data.title}**\n\n${data.content}`,
        type: "INFO",
        isPublic: true,
        adminName: session.user?.name || "Yönetim",
        adminImage: session.user?.image || undefined
    });

    revalidatePath("/");
    revalidatePath("/admin");
}

// 2. Duyuru Güncelleme
export async function updateAnnouncement(id: string, data: { title: string; content: string }) {
    const { session } = await checkAdmin();

    const oldAnn = await prisma.announcement.findUnique({ where: { id } });

    await prisma.announcement.update({
        where: { id },
        data: { title: data.title, content: data.content }
    });

    // 🚨 DISCORD GİZLİ LOG (Duyuru Düzenlendi - Diff)
    if (oldAnn) {
        const fields = [];
        if (oldAnn.title !== data.title) fields.push({ name: "Başlık", value: `~~${oldAnn.title}~~ ➡️ **${data.title}**` });
        if (oldAnn.content !== data.content) fields.push({ name: "İçerik", value: "Duyuru metni güncellendi." });

        if (fields.length > 0) {
            await sendDiscordLog({
                module: "SYSTEM",
                title: "✏️ Duyuru Güncellendi",
                description: "Sistemdeki bir duyuru değiştirildi.",
                type: "WARNING",
                fields: fields,
                isPublic: false,
                adminName: session.user?.name || "Yönetim",
                adminImage: session.user?.image || undefined
            });
        }
    }

    revalidatePath("/");
    revalidatePath("/admin");
}

// 3. Duyuru Silme
export async function deleteAnnouncement(id: string) {
    const { session } = await checkAdmin();

    const ann = await prisma.announcement.findUnique({ where: { id } });
    await prisma.announcement.delete({ where: { id } });

    // 🚨 DISCORD GİZLİ LOG (Duyuru Silindi)
    if (ann) {
        await sendDiscordLog({
            module: "SYSTEM",
            title: "🗑️ Duyuru Silindi",
            description: `**${ann.title}** başlıklı duyuru sistemden kaldırıldı.`,
            type: "DANGER",
            isPublic: false,
            adminName: session.user?.name || "Yönetim",
            adminImage: session.user?.image || undefined
        });
    }

    revalidatePath("/");
    revalidatePath("/admin");
}