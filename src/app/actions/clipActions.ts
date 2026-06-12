"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendDiscordLog } from "@/lib/discordLogger";
import { getServerSession } from "next-auth";

// YARDIMCI FONKSİYON: İşlemi yapan yetkilinin bilgilerini çekmek için
// NOT: Eğer getServerSession hata verirse içine (authOptions) eklemen gerekebilir.
async function getAdminData() {
    try {
        const session = await getServerSession();
        return {
            name: session?.user?.name || "Bilinmeyen Yetkili",
            image: session?.user?.image || undefined
        };
    } catch (error) {
        return { name: "Sistem Yetkilisi", image: undefined };
    }
}

// 1. YENİ KLİP EKLEME
export async function addClip(formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const tag = formData.get("tag") as string;

    // YouTube linkinden ID ayıklama
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/);
    const youtubeId = match && match[1] ? match[1] : null;

    if (!title || !youtubeId) {
        return { success: false, error: "Geçersiz Başlık veya YouTube Linki!" };
    }

    try {
        await prisma.clip.create({
            data: { title, youtubeId, tag }
        });

        // 🚨 DISCORD PUBLIC BİLDİRİMİ (Dev Kapak Fotoğrafı ile)
        const admin = await getAdminData();
        await sendDiscordLog({
            module: "MEDIA",
            title: "🎬 Yeni Klip Yayında!",
            description: `**${title}** başlıklı yeni bir **${tag}** klibi eklendi. Ana sayfadan veya aşağıdaki linkten hemen izle!`,
            type: "MEDIA",
            imageUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${youtubeId}`,
            isPublic: true,
            adminName: admin.name,
            adminImage: admin.image
        });

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Klip eklenemedi." };
    }
}

// 2. TÜM KLİPLERİ ÇEKME
export async function getClips() {
    try {
        return await prisma.clip.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Klipler çekilirken hata:", error);
        return [];
    }
}

// 3. KLİP SİLME
export async function deleteClip(id: string) {
    try {
        // Silmeden önce bilgilerini alıyoruz ki logda neyi sildiğimizi bilelim
        const clip = await prisma.clip.findUnique({ where: { id } });
        if (!clip) return { success: false, error: "Klip bulunamadı." };

        await prisma.clip.delete({ where: { id } });

        // 🚨 DISCORD GİZLİ LOG (Tehlike Uyarısı)
        const admin = await getAdminData();
        await sendDiscordLog({
            module: "SYSTEM",
            title: "🗑️ Klip Yayından Kaldırıldı",
            description: `**${clip.title}** başlıklı klip sistemden kalıcı olarak silindi.`,
            type: "DANGER",
            thumbnailUrl: `https://img.youtube.com/vi/${clip.youtubeId}/mqdefault.jpg`,
            isPublic: false,
            adminName: admin.name,
            adminImage: admin.image
        });

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Klip silinemedi." };
    }
}

// 4. GÜNÜN KLİBİNİ BELİRLEME (YILDIZLAMA)
export async function toggleFeaturedClip(id: string, currentStatus: boolean) {
    try {
        // Önce tüm kliplerin yıldızını söküyoruz (Sadece 1 tane günün klibi olabilir)
        await prisma.clip.updateMany({ data: { isFeatured: false } });

        const admin = await getAdminData();

        if (!currentStatus) {
            // Seçilen klibi yıldızlıyoruz
            const featuredClip = await prisma.clip.update({
                where: { id },
                data: { isFeatured: true }
            });

            // 🚨 DISCORD PUBLIC BİLDİRİMİ
            await sendDiscordLog({
                module: "MEDIA",
                title: "🌟 Günün Klibi Seçildi!",
                description: `**${featuredClip.title}** artık ana sayfada dev sinema ekranında sergileniyor!`,
                type: "MEDIA",
                imageUrl: `https://img.youtube.com/vi/${featuredClip.youtubeId}/maxresdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${featuredClip.youtubeId}`,
                isPublic: true,
                adminName: admin.name,
                adminImage: admin.image
            });
        } else {
            // Sadece yıldızı kaldırdıysa bunu gizlice logla
            await sendDiscordLog({
                module: "SYSTEM",
                title: "⭐ Günün Klibi İptal Edildi",
                description: "Ana sayfadaki günün klibi vitrini boşaltıldı.",
                type: "INFO",
                isPublic: false,
                adminName: admin.name,
                adminImage: admin.image
            });
        }

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Yıldızlama işlemi başarısız." };
    }
}

// 5. KLİBİ DÜZENLEME (ÖNCE/SONRA LOG DESTEKLİ)
export async function updateClip(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const tag = formData.get("tag") as string;

    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/);
    const youtubeId = match && match[1] ? match[1] : null;

    if (!title || !youtubeId) return { success: false, error: "Geçersiz veriler." };

    try {
        // Değişiklikleri kıyaslamak için eski klibi buluyoruz
        const oldClip = await prisma.clip.findUnique({ where: { id } });
        if (!oldClip) return { success: false, error: "Klip bulunamadı." };

        const updatedClip = await prisma.clip.update({
            where: { id },
            data: { title, youtubeId, tag }
        });

        // 🚨 DISCORD GİZLİ LOG İÇİN "DİFF" (FARK) HESAPLAMASI
        const fields = [];
        if (oldClip.title !== title) {
            fields.push({ name: "📝 Başlık Değişti", value: `~~${oldClip.title}~~ ➡️ **${title}**`, inline: false });
        }
        if (oldClip.tag !== tag) {
            fields.push({ name: "🏷️ Kategori Değişti", value: `~~${oldClip.tag}~~ ➡️ **${tag}**`, inline: false });
        }
        if (oldClip.youtubeId !== youtubeId) {
            fields.push({ name: "🔗 Video Linki Değişti", value: "Yeni bir YouTube bağlantısı eklendi.", inline: false });
        }

        // Eğer en az 1 tane değişiklik yapıldıysa log gönder
        if (fields.length > 0) {
            const admin = await getAdminData();
            await sendDiscordLog({
                module: "SYSTEM",
                title: "✏️ Klip Detayları Güncellendi",
                description: "Aşağıdaki klibin detaylarında değişiklik yapıldı.",
                type: "WARNING",
                fields: fields,
                thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
                isPublic: false,
                adminName: admin.name,
                adminImage: admin.image
            });
        }

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Güncelleme başarısız." };
    }
}