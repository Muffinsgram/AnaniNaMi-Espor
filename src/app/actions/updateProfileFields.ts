"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileFields(data: {
    bio?: string;
    customAvatar?: string;
    // Artık tek tek url'ler yerine socialLinks array'ini alıyoruz
    socialLinks?: { platform: string; url: string }[];
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { error: "Yetkisiz erişim!" };
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                bio: data.bio,
                customAvatar: data.customAvatar,
                // Prisma'daki Json sütununa doğrudan array'i gönderiyoruz
                socialLinks: data.socialLinks,
            },
        });

        revalidatePath("/profilim");
        revalidatePath("/kadro");
        return { success: true };
    } catch (error) {
        console.error("Profil güncelleme hatası:", error);
        return { error: "Güncelleme başarısız oldu." };
    }
}