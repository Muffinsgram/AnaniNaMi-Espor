"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Admin Yetki Kontrolü Yardımcı Fonksiyonu
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) throw new Error("Giriş yapılmadı!");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user?.role !== "ADMIN") throw new Error("Yetkisiz işlem!");

    return user;
}

export async function getAnnouncements() {
    return await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" }
    });
}

export async function createAnnouncement(data: { title: string; content: string }) {
    const admin = await checkAdmin();
    await prisma.announcement.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: admin.id,
        }
    });
    revalidatePath("/"); // Ana sayfayı ve admin panelini yenile
    revalidatePath("/admin");
}

export async function updateAnnouncement(id: string, data: { title: string; content: string }) {
    await checkAdmin();
    await prisma.announcement.update({
        where: { id },
        data: { title: data.title, content: data.content }
    });
    revalidatePath("/");
    revalidatePath("/admin");
}

export async function deleteAnnouncement(id: string) {
    await checkAdmin();
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
}