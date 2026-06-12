"use client";

import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { Gamepad2, Award } from "lucide-react";
import { FaTwitter, FaTwitch, FaInstagram, FaKickstarter, FaYoutube, FaTiktok, FaGlobe } from "react-icons/fa";
import { useRouter } from "next/navigation"; // YENİ: Yönlendirme için eklendi

const iconMap: any = {
    twitter: FaTwitter, twitch: FaTwitch, instagram: FaInstagram, kick: FaKickstarter,
    youtube: FaYoutube, tiktok: FaTiktok, other: FaGlobe
};

// YENİ: Unvanlara Göre Neon Parlama ve Rozet Ayarları
const ROLE_CONFIG: Record<string, any> = {
    KAPTAN: {
        color: "text-yellow-500",
        badge: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
        glow: "hover:shadow-[0_0_40px_rgba(234,179,8,0.35)] hover:border-yellow-500/40",
        neonLine: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]",
        icon: "👑"
    },
    KOÇ: {
        color: "text-purple-500",
        badge: "bg-purple-500/20 text-purple-500 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:border-purple-500/40",
        neonLine: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]",
        icon: "🧠"
    },
    OYUNCU: {
        color: "text-emerald-500",
        badge: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:border-emerald-500/40",
        neonLine: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
        icon: "🎮"
    },
    YEDEK: {
        color: "text-blue-500",
        badge: "bg-blue-500/20 text-blue-500 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
        glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:border-blue-500/40",
        neonLine: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]",
        icon: "⏳"
    }
};

export default function PlayerCard({ player, agent }: { player: any, agent: any }) {
    const router = useRouter(); // YENİ: Router tanımlandı
    const avatarUrl = player.customAvatar || player.image;

    // Oyuncunun unvanını alıyoruz, yoksa standart OYUNCU şablonunu yüklüyoruz
    const roleKey = player.teamRole || "OYUNCU";
    const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG["OYUNCU"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
            // TIKLAMA SORUNUNUN ÇÖZÜMÜ: Tıklama olayını en dış katmana aldık
            onClick={() => router.push(`/oyuncu/${player.id}`)}
        >
            <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="all"
                scale={1.02}
                transitionSpeed={2000}
                tiltMaxAngleX={6}
                tiltMaxAngleY={6}
                // config.glow sayesinde her unvan kendi neon renginde parlayacak
                className={`relative w-full h-[28rem] rounded-[2rem] bg-[#0B0D14] border border-white/10 ${config.glow} overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-end transition-all duration-500`}
            >
                {/* --- 1. KATMAN: CANLI VE BÜYÜK AJAN GÖRSELLERİ --- */}
                {agent && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
                        <img
                            src={agent.fullPortrait}
                            alt={agent.displayName}
                            className="absolute -right-12 -bottom-4 h-[115%] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out filter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        />
                        <img
                            src={agent.background}
                            alt="bg"
                            className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-25 mix-blend-overlay transition-opacity duration-700"
                        />
                    </div>
                )}

                {/* --- 2. KATMAN: OKUNABİLİRLİK İÇİN KARARTMA --- */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-[#0B0D14]/80 to-transparent z-10 transition-colors duration-500 group-hover:via-[#0B0D14]/90 pointer-events-none" />

                {/* --- 3. KATMAN: ÜST BİLGİ ROZETLERİ --- */}
                <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {agent?.role?.displayName && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
                            {agent.displayIcon && <img src={agent.displayIcon} alt="Role" className="w-3.5 h-3.5 filter brightness-200" />}
                            <span className="text-[10px] font-black tracking-widest text-white uppercase">
                                {agent.role.displayName}
                            </span>
                        </div>
                    )}

                    {/* Geliştirilmiş Cafcaflı Unvan Rozeti */}
                    <div className={`px-3 py-1.5 border backdrop-blur-md rounded-lg shadow-lg flex items-center gap-1.5 ${config.badge}`}>
                        <span className="text-xs">{config.icon}</span>
                        <span className="text-[9px] font-black tracking-widest uppercase">
                            {roleKey}
                        </span>
                    </div>
                </div>

                {/* --- 4. KATMAN: KART İÇERİĞİ (Aşağıdan Yukarı Smooth Kayma) --- */}
                <div className="relative w-full p-6 z-30 flex flex-col justify-end">

                    <div className="transform translate-y-[88px] group-hover:translate-y-0 transition-transform duration-500 ease-out">

                        {/* Profil Fotosu */}
                        <div className="mb-4">
                            <img
                                src={avatarUrl}
                                alt={player.name}
                                className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover shadow-lg transition-transform duration-500 group-hover:scale-105 bg-[#0B0D14]"
                            />
                        </div>

                        {/* İsim ve Riot ID */}
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-1.5 flex items-center gap-2">
                            {player.name}
                            {player.teamRole === "ADMIN" && <Award size={18} className="text-primary" />}
                        </h2>
                        <div className="flex items-center gap-1.5 text-gray-300 font-medium text-sm mb-4">
                            <Gamepad2 size={16} className="text-primary" />
                            <span>{player.riotId}</span>
                        </div>

                        {/* Hover ile Açılan Detay Bölümü */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">

                            {/* Dekoratif Neon Çizgi (Oyuncunun unvan rengine adapte oluyor) */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`h-1 w-8 rounded-full ${config.neonLine}`}></div>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>

                            {/* Biyografi */}
                            <p className="text-sm text-gray-300 font-medium leading-relaxed mb-5 line-clamp-2">
                                {player.bio ? player.bio : "Kadroda yerini aldı, arenada kendini kanıtlamaya hazır."}
                            </p>

                            {/* Sosyal Medya İkonları */}
                            <div className="flex gap-2">
                                {player.socialLinks && player.socialLinks.length > 0 ? (
                                    player.socialLinks.map((link: any, index: number) => {
                                        const Icon = iconMap[link.platform] || iconMap["other"];
                                        return (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()} // Tıklamanın karta sızmasını engeller
                                                className="p-2.5 bg-white/10 border border-white/5 hover:border-primary hover:bg-primary/20 text-white rounded-xl transition-all duration-300"
                                            >
                                                <Icon size={16} />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        Bağlantı Yok
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </Tilt>
        </motion.div>
    );
}