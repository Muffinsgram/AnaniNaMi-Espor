import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, Sword, Clock } from "lucide-react";

export const revalidate = 0;

export default async function FiksturPage() {
    const matches = await prisma.match.findMany({
        orderBy: { date: "asc" }
    });

    return (
        <main className="min-h-screen pt-32 px-4 pb-20 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Maç Takvimi</h1>
                <p className="text-gray-400">Takımımızın yaklaşan ve geçmiş tüm karşılaşmaları.</p>
            </div>

            <div className="space-y-6">
                {matches.map((match) => (
                    <div key={match.id} className="group relative bg-[#0B0C10]/60 border border-white/5 hover:border-primary/50 p-8 rounded-[2rem] transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Rakip Bilgisi */}
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                <Sword size={32} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">{match.opponent}</h3>
                                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{match.status}</p>
                            </div>
                        </div>

                        {/* Maç Detayları */}
                        <div className="flex items-center gap-8 text-sm font-bold text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-primary" />
                                {new Date(match.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                {match.map}
                            </div>
                        </div>

                        {/* Durum Etiketi */}
                        <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${match.status === 'UPCOMING' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400'}`}>
                            {match.status === 'UPCOMING' ? 'Yaklaşıyor' : match.status}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}