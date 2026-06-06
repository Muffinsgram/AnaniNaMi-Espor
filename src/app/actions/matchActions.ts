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
            status: "UPCOMING"
        }
    });
    revalidatePath("/admin");
    revalidatePath("/fikstur");
    return { success: true };
}

// 2. Maçları Çekme (Hata aldığın eksik fonksiyon)
export async function getMatches() {
    return await prisma.match.findMany({
        orderBy: { date: 'asc' }
    });
}

// 3. Maç Silme (Hata aldığın eksik fonksiyon)
export async function deleteMatch(id: string) {
    await prisma.match.delete({
        where: { id: id }
    });
    revalidatePath("/admin");
    revalidatePath("/fikstur");
    return { success: true };
}