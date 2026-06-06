import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Sword, Trophy } from "lucide-react";

export const revalidate = 0;

const mapImages: Record<string, string> = {
    "Ascent": "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
    "Bind": "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
    "Haven": "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png",
    "Split": "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png",
    "Lotus": "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png",
    "Sunset": "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png",
    "Abyss": "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/listviewicontall.png",
    "Icebox": "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png",
    "Pearl": "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png",
    "Breeze": "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicontall.png",
    "Fracture": "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicontall.png"
};

const FALLBACK_IMAGE = "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7b0f697dbaf2b719/60ee59955e82a01290356bc0/Valorant_Key_Art_1920x1080.jpg";

export default async function FiksturPage() {
    const matches = await prisma.match.findMany({
        orderBy: { date: "asc" }
    });

    return (
        <main className="min-h-screen pt-32 px-4 pb-20 max-w-5xl mx-auto">

            <div className="text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter relative z-10 flex justify-center items-center gap-4 drop-shadow-2xl">
                    <Trophy className="text-primary drop-shadow-[0_0_15px_rgba(255,70,85,0.5)]" size={56} /> MAÇLAR
                </h1>
                <p className="text-gray-400 text-lg relative z-10 font-medium">Takımımızın sezon içindeki tüm karşılaşmaları ve skorları.</p>
            </div>

            <div className="space-y-10">
                {matches.length === 0 ? (
                    <div className="text-center p-16 bg-[#0B0C10]/80 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                        <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">Sezon henüz başlamadı.</p>
                    </div>
                ) : (
                    matches.map((match) => {
                        const mapBg = mapImages[match.map] || FALLBACK_IMAGE;
                        const isLive = match.status === 'LIVE';
                        const isCompleted = match.status === 'COMPLETED';

                        const displayScore = match.score && match.score.trim() !== "" ? match.score : "0-0";

                        return (
                            <div key={match.id} className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,70,85,0.2)] border border-white/10 hover:border-primary/50">

                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={mapBg}
                                        alt={match.map}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/70 to-[#0B0C10]"></div>
                                </div>

                                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">

                                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Ev Sahibi</span>
                                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg">ANANINAMI<br />ESPOR</h3>
                                    </div>

                                    <div className="flex flex-col items-center justify-center shrink-0 w-64 bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-2xl">

                                        <div className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg border ${isLive ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' :
                                            isCompleted ? 'bg-white text-black border-white' :
                                                'bg-primary/20 text-primary border-primary/30'
                                            }`}>
                                            {isLive ? 'CANLI' : isCompleted ? 'TAMAMLANDI' : 'YAKLAŞIYOR'}
                                        </div>

                                        <div className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] whitespace-nowrap">
                                            {!isCompleted && !isLive && (match.score === "0-0" || !match.score) ? (
                                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-gray-600 italic">VS</span>
                                            ) : (
                                                <span className={isLive ? "text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600" : "text-white"}>
                                                    {displayScore}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center gap-2 mt-6 text-[11px] font-black text-gray-300 w-full">
                                            <div className="flex items-center justify-center gap-2 bg-black/60 w-full py-2 rounded-xl border border-white/5">
                                                <Calendar size={14} className="text-primary" />
                                                {new Date(match.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })} - {new Date(match.date).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center justify-center gap-2 bg-black/60 w-full py-2 rounded-xl border border-white/5">
                                                <MapPin size={14} className="text-primary" />
                                                <span className="uppercase tracking-widest">{match.map}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 bg-white/5 px-3 py-1 rounded-full border border-white/10">Deplasman</span>
                                        <h3 className="text-3xl md:text-4xl font-black text-gray-300 uppercase tracking-wider drop-shadow-lg">{match.opponent}</h3>
                                    </div>

                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}