import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    // Güvenlik: Giriş yapmamışsa veriyi reddet
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    // Riot ID bağlamış herkesi getir
    const users = await prisma.user.findMany({
        where: { isTrackerLinked: true },
        select: { id: true, name: true, image: true, riotId: true, favoriteAgent: true, teamRole: true },
        orderBy: { id: 'desc' }
    });

    return NextResponse.json(users);
}