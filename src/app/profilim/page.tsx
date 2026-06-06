import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient"; // Client tarafındaki düzenleme bileşeni

export default async function ProfilPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    // Veritabanından kullanıcının tüm bilgilerini çek
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
    });

    return (
        <main className="min-h-screen pt-32 px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Buraya ProfileClient bileşenini ekleyeceğiz */}
                <ProfileClient initialUser={user} />
            </div>
        </main>
    );
}