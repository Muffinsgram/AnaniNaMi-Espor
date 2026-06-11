"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addClip(formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const tag = formData.get("tag") as string;

    // Kullanıcı hangi YouTube linkini atarsa atsın (youtu.be, youtube.com/watch vb.) ID'yi koparan Regex
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/);
    const youtubeId = match && match[1] ? match[1] : null;

    if (!youtubeId) {
        return { success: false, error: "Geçersiz YouTube Linki!" };
    }

    try {
        await prisma.clip.create({
            data: { title, youtubeId, tag }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Klip eklenemedi." };
    }
}

export async function getClips() {
    return await prisma.clip.findMany({
        orderBy: { createdAt: 'desc' }
    });
}