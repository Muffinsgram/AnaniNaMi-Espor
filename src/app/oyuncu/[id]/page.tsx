import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShieldCheck, Target, Trophy, Swords, Star, Award, ChevronLeft, Activity, Crosshair } from "lucide-react";

interface Props {
    params: Promise<{ id: string }> | { id: string };
}

// 1. UNVAN RENKLERİ VE TASARIM AYARLARI
const roleStyles: any = {
    KAPTAN: "from-yellow-500/20 to-transparent text-yellow-500 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)]",
    KOÇ: "from-purple-500/20 to-transparent text-purple-500 border-purple-500/30",
    OYUNCU: "from-emerald-500/20 to-transparent text-emerald-500 border-emerald-500/30",
    YEDEK: "from-blue-500/20 to-transparent text-blue-500 border-blue-500/30",
    ÜYE: "from-white/5 to-transparent text-gray-400 border-white/10"
};

export default async function PlayerProfilePage({ params }: Props) {
    const resolvedParams = await params;

    // 2. OYUNCUYU VERİTABANINDAN ÇEK
    const user = await prisma.user.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!user) notFound();

    const roleTag = user.teamRole || "ÜYE";

    // 3. CANLI VALORANT VERİLERİNİ ÇEKME (HenrikDev API)
    let liveRankData = null;
    let rankName = "Derecesiz";
    let rankImage = "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png";
    let elo = 0;

    if (user.riotId && user.riotId.includes("#")) {
        const [name, tag] = user.riotId.split("#");
        try {
            // YENİ: .env dosyasından anahtarı çekiyoruz
            const apiKey = process.env.VALORANT_API_KEY || "";

            const res = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
                headers: {
                    // YENİ: API'ye kimliğimizi doğruluyoruz
                    "Authorization": apiKey
                },
                next: { revalidate: 1800 } // Veriyi yarım saatte bir yenile
            });

            const json = await res.json();

            // Eğer başarıyla çekerse verileri ekrana bas
            if (res.status === 200 && json.data) {
                liveRankData = json.data;
                rankName = liveRankData.currenttierpatched || "Derecesiz";
                rankImage = liveRankData.images?.large || rankImage;
                elo = liveRankData.ranking_in_tier || 0;
            } else {
                // Hata varsa terminalde görelim ki neyin yanlış olduğunu anlayalım
                console.error("API Hatası Döndü:", json.message || res.status);
            }
        } catch (error) {
            console.error("Valorant API Bağlantı Hatası:", error);
        }
    }

    return (
        <main className="w-full min-h-screen bg-[#0B0C10] text-white pt-32 px-4 pb-24 flex flex-col items-center justify-start relative overflow-hidden">
            {/* Arka Plan Efektleri */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] pointer-events-none"></div>

            <div className="w-full max-w-5xl relative z-10">
                {/* Geri Dön Butonu */}
                <a href="/kadro" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 font-bold transition-colors group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kadroya Geri Dön
                </a>

                {/* ANA KART ÜST PANEL */}
                <div className={`w-full bg-gradient-to-b ${roleStyles[roleTag]} border backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden`}>

                    {/* Oyuncu Büyük Profil Fotoğrafı */}
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shrink-0 bg-[#111217]">
                        <img src={user.image || "/default-avatar.png"} alt={user.name || "Oyuncu"} className="w-full h-full object-cover" />
                    </div>

                    {/* Oyuncu Kimlik Bilgileri */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 bg-black/40 border border-white/10 text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 text-white">
                                {roleTag === "KAPTAN" && "👑"}
                                {roleTag === "KOÇ" && "🧠"}
                                {roleTag === "OYUNCU" && "🎮"}
                                {roleTag === "YEDEK" && "⏳"}
                                {roleTag}
                            </span>
                            {user.role === "ADMIN" && (
                                <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-[10px] font-black text-red-500 uppercase tracking-widest rounded-full flex items-center gap-1">
                                    <ShieldCheck size={12} /> YÖNETİM
                                </span>
                            )}
                            {liveRankData && (
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black text-emerald-500 uppercase tracking-widest rounded-full flex items-center gap-1 animate-pulse">
                                    <Activity size={12} /> CANLI VERİ
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase">{user.name}</h1>

                        <p className="text-xl font-bold text-gray-400 tracking-wide flex items-center justify-center md:justify-start gap-2">
                            <Target size={20} className="text-primary" /> {user.riotId || "Riot ID Bilinmiyor"}
                        </p>
                    </div>

                    {/* CANLI RANK BÖLÜMÜ (Sağ Taraf) */}
                    <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 p-6 rounded-3xl shrink-0 min-w-[160px] backdrop-blur-md">
                        <img src={rankImage} alt={rankName} className="w-24 h-24 object-contain mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Anlık Kademe</span>
                        <h3 className="text-lg font-black text-white uppercase text-center">{rankName}</h3>
                        {elo > 0 && (
                            <span className="text-sm font-bold text-primary mt-1">{elo} KP</span>
                        )}
                    </div>
                </div>

                {/* İSTATİSTİKLER VE DETAYLAR PANELİ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Kart 1: Favori Ajan */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-5"><Award size={28} /></div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Uzmanlık Alanı</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider">{user.favoriteAgent || "Belirtilmedi"}</h3>
                    </div>

                    {/* Kart 2: Rol / Pozisyon */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl mb-5"><Crosshair size={28} /></div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Takım İçi Rol</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider">{roleTag}</h3>
                    </div>

                    {/* Kart 3: Turnuva Durumu */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl mb-5"><Trophy size={28} /></div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Premier & Turnuvalar</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider">Aktif Kadroda</h3>
                    </div>
                </div>

                {/* BİYOGRAFİ / TAKTİK RAPORU */}
                <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 mt-6 text-left backdrop-blur-md">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-3">
                        <Star size={24} className="text-primary" /> Oyuncu Raporu & Biyografi
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed font-medium">
                        {user.bio ? user.bio : "Bu oyuncu henüz kendi biyografisini oluşturmadı. Ancak takımımızın taktiksel şemalarında önemli bir rol oynamaktadır. Antrenman performansları ve Premier maçlarındaki uyumu sistem tarafından anlık analiz edilmektedir."}
                    </p>
                </div>
            </div>
        </main>
    );
}