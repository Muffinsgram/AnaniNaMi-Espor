"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Maç Ekleme
export async function createMatch(data: { opponent: string, date: Date, map: string }) {
    await prisma.match.create({
        data: {
            opponent: data.opponent,
            date: data.date,
            map: data.map,
            status: "UPCOMING",
            score: "0-0" // Başlangıç skoru
        }
    });
    revalidatePath("/admin");
    revalidatePath("/fikstur");
    return { success: true };
}

// 2. Skor ve Durum Güncelleme (Eksik olan fonksiyon buydu)
export async function updateMatchScore(id: string, score: string, status: string) {
    await prisma.match.update({
        where: { id },
        data: { score, status }
    });
    revalidatePath("/admin");
    revalidatePath("/fikstur");
}

// 3. Maçları Çekme
export async function getMatches() {
    return await prisma.match.findMany({
        orderBy: { date: 'asc' }
    });
}

// 4. Maç Silme
export async function deleteMatch(id: string) {
    await prisma.match.delete({
        where: { id }
    });
    revalidatePath("/admin");
    revalidatePath("/fikstur");
    return { success: true };
}