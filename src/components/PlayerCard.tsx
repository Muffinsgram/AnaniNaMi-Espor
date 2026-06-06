"use client";

import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { Gamepad2, Award } from "lucide-react";
import { FaTwitter, FaTwitch, FaInstagram, FaKickstarter, FaYoutube, FaTiktok, FaGlobe } from "react-icons/fa";

const iconMap: any = {
    twitter: FaTwitter, twitch: FaTwitch, instagram: FaInstagram, kick: FaKickstarter,
    youtube: FaYoutube, tiktok: FaTiktok, other: FaGlobe
};

export default function PlayerCard({ player, agent }: { player: any, agent: any }) {
    const avatarUrl = player.customAvatar || player.image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
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
                className="relative w-full h-[28rem] rounded-[2rem] bg-[#0B0D14] border border-white/10 hover:border-primary/50 overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-end"
            >
                {/* --- 1. KATMAN: CANLI VE BÜYÜK AJAN GÖRSELLERİ --- */}
                {agent && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
                        <img
                            src={agent.fullPortrait}
                            alt={agent.displayName}
                            // Ajan canlı renkleriyle, blur olmadan büyük bir şekilde duruyor
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

                {/* --- 3. KATMAN: ÜST BİLGİ ROZETLERİ (Gereksiz kodlar yerine modern rozet) --- */}
                <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {agent?.role?.displayName && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
                            {agent.displayIcon && <img src={agent.displayIcon} alt="Role" className="w-3.5 h-3.5 filter brightness-200" />}
                            <span className="text-[10px] font-black tracking-widest text-white uppercase">
                                {agent.role.displayName}
                            </span>
                        </div>
                    )}
                    <div className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-lg shadow-lg">
                        <span className="text-[9px] font-black tracking-widest text-primary uppercase">
                            {player.teamRole}
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

                            {/* Dekoratif Neon Çizgi (Ayrıntı katar ama yormaz) */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>

                            {/* Biyografi (Net ve okunaklı) */}
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
                                                onClick={(e) => e.stopPropagation()}
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