"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendDiscordLog } from "@/lib/discordLogger";
import { getServerSession } from "next-auth";

// Yetkili bilgilerini çeken yardımcı fonksiyon
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

// 1. Maç Ekleme
export async function createMatch(data: { opponent: string, date: Date, map: string }) {
    try {
        await prisma.match.create({
            data: {
                opponent: data.opponent,
                date: data.date,
                map: data.map,
                status: "UPCOMING",
                score: "0-0"
            }
        });

        // 🚨 DISCORD PUBLIC BİLDİRİMİ (Yeni Maç Planlandı)
        const admin = await getAdminData();
        await sendDiscordLog({
            module: "MATCH",
            title: "🗓️ Yeni Maç Planlandı!",
            description: `Takımımız **${data.opponent}** karşısında sahaya çıkıyor!`,
            type: "INFO",
            fields: [
                { name: "Rakip", value: data.opponent, inline: true },
                { name: "Harita", value: data.map.toUpperCase(), inline: true },
                { name: "Tarih", value: new Date(data.date).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" }), inline: false }
            ],
            isPublic: true,
            adminName: admin.name,
            adminImage: admin.image
        });

        revalidatePath("/admin");
        revalidatePath("/fikstur");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Maç eklenemedi." };
    }
}

// 2. Skor ve Durum Güncelleme
export async function updateMatchScore(id: string, score: string, status: string) {
    try {
        const oldMatch = await prisma.match.findUnique({ where: { id } });
        if (!oldMatch) return { success: false, error: "Maç bulunamadı." };

        await prisma.match.update({
            where: { id },
            data: { score, status }
        });

        // 🚨 DISCORD GİZLİ LOG (Skor/Durum Değişikliği)
        const fields = [];
        if (oldMatch.score !== score) {
            fields.push({ name: "📊 Skor Değişti", value: `~~${oldMatch.score}~~ ➡️ **${score}**`, inline: true });
        }
        if (oldMatch.status !== status) {
            const statusTR = { UPCOMING: "Yaklaşıyor", LIVE: "Canlı", COMPLETED: "Tamamlandı" };
            fields.push({
                name: "🔄 Durum Değişti",
                value: `~~${statusTR[oldMatch.status as keyof typeof statusTR]}~~ ➡️ **${statusTR[status as keyof typeof statusTR]}**`,
                inline: true
            });
        }

        if (fields.length > 0) {
            const admin = await getAdminData();
            await sendDiscordLog({
                module: "MATCH",
                title: `✏️ Maç Güncellendi: ${oldMatch.opponent}`,
                description: "Maç verilerinde değişiklik yapıldı.",
                type: "WARNING",
                fields: fields,
                isPublic: false,
                adminName: admin.name,
                adminImage: admin.image
            });
        }

        revalidatePath("/admin");
        revalidatePath("/fikstur");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Maç güncellenemedi." };
    }
}

// 3. Maçları Çekme
export async function getMatches() {
    return await prisma.match.findMany({
        orderBy: { date: 'asc' }
    });
}

// 4. Maç Silme
export async function deleteMatch(id: string) {
    try {
        const match = await prisma.match.findUnique({ where: { id } });
        await prisma.match.delete({ where: { id } });

        // 🚨 DISCORD GİZLİ LOG (Maç İptali)
        if (match) {
            const admin = await getAdminData();
            await sendDiscordLog({
                module: "MATCH",
                title: "🗑️ Maç İptal Edildi / Silindi",
                description: `**${match.opponent}** maçı komuta merkezinden kalıcı olarak silindi.`,
                type: "DANGER",
                isPublic: false,
                adminName: admin.name,
                adminImage: admin.image
            });
        }

        revalidatePath("/admin");
        revalidatePath("/fikstur");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Maç silinemedi." };
    }
}