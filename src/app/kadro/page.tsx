import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import AnimatedKadroGrid from "@/components/AnimatedKadroGrid";

export const revalidate = 0;

export default async function KadroPage() {
    const players = await prisma.user.findMany({
        where: {
            isTrackerLinked: true,
            teamRole: {
                in: ["OYUNCU", "KAPTAN", "KOÇ", "YEDEK"]
            }
        },
        select: {
            id: true,
            name: true,
            image: true,
            riotId: true,
            favoriteAgent: true,
            teamRole: true,
            customAvatar: true,
            socialLinks: true,
            bio: true
        },
    });

    const res = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=tr-TR");
    const data = await res.json();
    const agents = data.data;

    return (
        // relative ve overflow-hidden sınıflarını ambiyans ışıkları taşmasın diye ekledik
        <main className="relative w-full min-h-screen pt-32 px-4 pb-24 overflow-hidden">

            {/* Fütüristik Arka Plan Işıkları (Ambient Glow) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Başlık Kısmı */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]">
                        <Users size={36} className="drop-shadow-lg" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white mb-6 tracking-tighter">
                        Anani<span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]">Na'Mi</span> Kadrosu
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
                        Arenanın hakimleri. Güncel sezon aktif oyuncularımız ve uzmanlaştıkları ajanlar.
                    </p>
                </div>

                {players.length === 0 ? (
                    <div className="w-full py-24 flex flex-col items-center justify-center bg-white/30 dark:bg-gray-900/30 backdrop-blur-2xl rounded-[3rem] border border-white/20 dark:border-gray-800/50 shadow-2xl">
                        <Users size={48} className="text-gray-400 mb-4 opacity-50" />
                        <p className="text-xl text-gray-500 font-semibold tracking-wide">Kadromuz çok yakında duyurulacaktır.</p>
                    </div>
                ) : (
                    <AnimatedKadroGrid players={players} agents={agents} />
                )}

            </div>
        </main>
    );
}