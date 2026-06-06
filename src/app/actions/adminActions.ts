"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Oyuncunun rolünü "ÜYE" veya "OYUNCU" olarak değiştirir
export async function togglePlayerRole(userId: string, currentRole: string) {
    try {
        const newRole = currentRole === "OYUNCU" ? "ÜYE" : "OYUNCU";

        await prisma.user.update({
            where: { id: userId },
            data: { teamRole: newRole },
        });

        // Değişiklik anında yansısın diye sayfaları yeniliyoruz
        revalidatePath("/admin");
        revalidatePath("/kadro");

        return { success: true, newRole };
    } catch (error) {
        console.error("Rol değiştirme hatası:", error);
        return { error: "İşlem sırasında bir hata oluştu." };
    }
}