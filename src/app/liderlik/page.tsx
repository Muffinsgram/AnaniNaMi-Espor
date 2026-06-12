import { prisma } from "@/lib/prisma";
import { Trophy, Medal, Target, Flame, ChevronRight, Activity, Crosshair } from "lucide-react";

export const revalidate = 3600;

export default async function LeaderboardPage() {
    const users = await prisma.user.findMany({
        where: {
            riotId: { not: null },
            teamRole: { in: ["OYUNCU", "KAPTAN", "KOÇ", "YEDEK"] }
        },
        select: { id: true, name: true, image: true, riotId: true, teamRole: true, favoriteAgent: true }
    });

    const apiKey = process.env.VALORANT_API_KEY || "";

    const rawLeaderboard = await Promise.all(users.map(async (user) => {
        if (!user.riotId || !user.riotId.includes("#")) return null;
        const [name, tag] = user.riotId.split("#");

        try {
            const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
                headers: { "Authorization": apiKey },
                next: { revalidate: 3600 }
            });
            const json = await res.json();

            if (res.status === 200 && json.data) {
                return {
                    user,
                    tier: json.data.currenttier || 0,
                    rr: json.data.ranking_in_tier || 0,
                    rankName: json.data.currenttierpatched || "Derecesiz",
                    rankImage: json.data.images?.large || "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png",
                };
            }
        } catch (error) {
            console.error(`${user.riotId} için veri çekilemedi.`);
        }
        return null;
    }));

    const leaderboard = rawLeaderboard
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => {
            if (b.tier !== a.tier) return b.tier - a.tier;
            return b.rr - a.rr;
        });

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    // Kürsü Renk Konfigürasyonları
    const podiumStyles = [
        {
            bg: "from-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-500",
            glow: "shadow-[0_0_50px_rgba(234,179,8,0.3)]", icon: <Trophy size={40} className="text-yellow-500" />
        },
        {
            bg: "from-gray-300/20", border: "border-gray-300/50", text: "text-gray-300",
            glow: "shadow-[0_0_40px_rgba(209,213,219,0.2)]", icon: <Medal size={32} className="text-gray-300" />
        },
        {
            bg: "from-orange-700/20", border: "border-orange-700/50", text: "text-orange-500",
            glow: "shadow-[0_0_40px_rgba(194,65,12,0.2)]", icon: <Medal size={28} className="text-orange-500" />
        }
    ];

    return (
        <main className="w-full min-h-screen bg-[#0B0C10] text-white pt-32 px-4 pb-24 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                <div className="flex flex-col items-center text-center mb-20">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary mb-6 shadow-[0_0_30px_rgba(255,70,85,0.15)] animate-pulse">
                        <Flame size={36} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                        Takım İçi <span className="text-primary">Rekabet</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl flex items-center justify-center gap-2">
                        <Activity size={16} className="text-primary" /> API üzerinden anlık çekilen resmi Valorant sıralamasıdır.
                    </p>
                </div>

                {leaderboard.length === 0 ? (
                    <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl text-gray-400 font-bold">API verileri yükleniyor veya kadroda oyuncu bulunamadı.</div>
                ) : (
                    <>
                        {/* İLK 3 - KÜRSÜ (PODIUM) AVATAR + ROZET TASARIMI */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end mt-10">

                            {/* 2. SIRA (Sol) */}
                            {topThree[1] && (
                                <a href={`/oyuncu/${topThree[1].user.id}`} className="order-2 md:order-1 transform transition-all hover:-translate-y-2">
                                    <div className={`bg-gradient-to-t ${podiumStyles[1].bg} bg-[#111217] border-2 ${podiumStyles[1].border} rounded-[2rem] p-6 flex flex-col items-center text-center relative h-[320px] justify-end`}>
                                        <div className="absolute -top-8 bg-[#111217] p-2 rounded-full border-2 border-gray-300/50 shadow-xl">{podiumStyles[1].icon}</div>

                                        {/* Avatar + Rank Rozeti Kombinasyonu */}
                                        <div className="relative mb-6 mt-4">
                                            <img src={topThree[1].user.image || "/default-avatar.png"} alt={topThree[1].user.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#111217] shadow-xl ring-2 ring-gray-300" />
                                            <img src={topThree[1].rankImage} className="absolute -bottom-4 -right-4 w-12 h-12 drop-shadow-2xl" alt="Rank" />
                                        </div>

                                        <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-1">{topThree[1].user.name}</h3>
                                        <div className="flex gap-2 text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">
                                            <span className="bg-white/5 px-2 py-1 rounded">{topThree[1].user.favoriteAgent || "Ajan Yok"}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded">{topThree[1].user.teamRole}</span>
                                        </div>
                                        <span className={`px-4 py-1.5 bg-black/40 rounded-lg text-xs font-black uppercase tracking-widest ${podiumStyles[1].text} border ${podiumStyles[1].border}`}>{topThree[1].rr} Puan</span>
                                    </div>
                                </a>
                            )}

                            {/* 1. SIRA (Orta - En Yüksek) */}
                            {topThree[0] && (
                                <a href={`/oyuncu/${topThree[0].user.id}`} className="order-1 md:order-2 transform transition-all hover:-translate-y-2">
                                    <div className={`bg-gradient-to-t ${podiumStyles[0].bg} bg-[#111217] border-2 ${podiumStyles[0].border} rounded-[2rem] p-8 flex flex-col items-center text-center relative h-[360px] justify-end z-10 scale-105 ${podiumStyles[0].glow}`}>
                                        <div className="absolute -top-10 bg-[#111217] p-3 rounded-full border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.4)]">{podiumStyles[0].icon}</div>

                                        {/* Şampiyon Avatar + Rank Rozeti Kombinasyonu */}
                                        <div className="relative mb-6 mt-4">
                                            <img src={topThree[0].user.image || "/default-avatar.png"} alt={topThree[0].user.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#111217] shadow-xl ring-4 ring-yellow-500" />
                                            <img src={topThree[0].rankImage} className="absolute -bottom-5 -right-5 w-16 h-16 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" alt="Rank" />
                                        </div>

                                        <h3 className="text-3xl font-black uppercase tracking-wider text-white mb-1">{topThree[0].user.name}</h3>
                                        <div className="flex gap-2 text-xs uppercase font-black tracking-widest text-yellow-500/70 mb-4">
                                            <span className="bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20"><Crosshair size={12} className="inline mr-1 -mt-0.5" /> {topThree[0].user.favoriteAgent || "Ajan Yok"}</span>
                                            <span className="bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">{topThree[0].user.teamRole}</span>
                                        </div>
                                        <span className={`px-5 py-2 bg-yellow-500/20 rounded-xl text-sm font-black uppercase tracking-widest ${podiumStyles[0].text} border ${podiumStyles[0].border}`}>{topThree[0].rr} Puan</span>
                                    </div>
                                </a>
                            )}

                            {/* 3. SIRA (Sağ) */}
                            {topThree[2] && (
                                <a href={`/oyuncu/${topThree[2].user.id}`} className="order-3 transform transition-all hover:-translate-y-2">
                                    <div className={`bg-gradient-to-t ${podiumStyles[2].bg} bg-[#111217] border-2 ${podiumStyles[2].border} rounded-[2rem] p-6 flex flex-col items-center text-center relative h-[300px] justify-end`}>
                                        <div className="absolute -top-8 bg-[#111217] p-2 rounded-full border-2 border-orange-700/50 shadow-xl">{podiumStyles[2].icon}</div>

                                        {/* Avatar + Rank Rozeti Kombinasyonu */}
                                        <div className="relative mb-6 mt-4">
                                            <img src={topThree[2].user.image || "/default-avatar.png"} alt={topThree[2].user.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#111217] shadow-xl ring-2 ring-orange-700" />
                                            <img src={topThree[2].rankImage} className="absolute -bottom-3 -right-3 w-10 h-10 drop-shadow-2xl" alt="Rank" />
                                        </div>

                                        <h3 className="text-xl font-black uppercase tracking-wider text-white mb-1">{topThree[2].user.name}</h3>
                                        <div className="flex gap-2 text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">
                                            <span className="bg-white/5 px-2 py-1 rounded">{topThree[2].user.favoriteAgent || "Ajan Yok"}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded">{topThree[2].user.teamRole}</span>
                                        </div>
                                        <span className={`px-4 py-1.5 bg-black/40 rounded-lg text-xs font-black uppercase tracking-widest ${podiumStyles[2].text} border ${podiumStyles[2].border}`}>{topThree[2].rr} Puan</span>
                                    </div>
                                </a>
                            )}
                        </div>

                        {/* DİĞERLERİ - LİSTE */}
                        {others.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {others.map((p, index) => (
                                    <a key={p.user.id} href={`/oyuncu/${p.user.id}`} className="flex flex-col md:flex-row items-center gap-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 p-4 md:pr-8 rounded-3xl transition-all group shadow-lg">

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-12 h-12 flex items-center justify-center font-black text-2xl text-gray-600 group-hover:text-primary transition-colors">
                                                #{index + 4}
                                            </div>
                                            <div className="relative">
                                                <img src={p.user.image || "/default-avatar.png"} alt={p.user.name} className="w-16 h-16 rounded-full object-cover border border-white/10" />
                                                <img src={p.rankImage} alt="Rank" className="absolute -bottom-2 -right-2 w-8 h-8 drop-shadow-md" />
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left w-full md:w-auto">
                                            <h4 className="text-xl font-black uppercase tracking-wider text-white">{p.user.name}</h4>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
                                                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Target size={12} /> {p.user.riotId}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-gray-300">{p.user.favoriteAgent}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-gray-300">{p.user.teamRole}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                                            <div className="flex flex-col text-left md:text-right">
                                                <span className="text-sm font-black text-white">{p.rankName}</span>
                                                <span className="text-xs font-bold text-primary">{p.rr} Kademe Puanı</span>
                                            </div>
                                            <ChevronRight size={24} className="text-gray-600 group-hover:text-primary transition-colors ml-4" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}