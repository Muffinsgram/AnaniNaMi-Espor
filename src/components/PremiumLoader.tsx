"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PremiumLoader({ children }: { children: React.ReactNode }) {
    // Aşamalar: "loading" (Dönüyor) -> "expanding" (Ekranı kaplıyor) -> "complete" (Bitti)
    const [phase, setPhase] = useState<"loading" | "expanding" | "complete">("loading");

    useEffect(() => {
        // 2. saniyede patlama animasyonunu başlat
        const timer1 = setTimeout(() => setPhase("expanding"), 2000);
        // 3.5 saniyede (Tüm geçişler ve fade efektleri tamamen bittiğinde) loader'ı DOM'dan kaldır
        const timer2 = setTimeout(() => setPhase("complete"), 3500);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const starClipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

    // Sinematik yavaşlama/hızlanma eğrisi (Valorant/Riot tarzı akıcı geçiş sağlar)
    const cinematicEase = [0.76, 0, 0.24, 1];

    return (
        <div className="relative w-full min-h-screen bg-[#0B0C10] overflow-hidden">

            {/* YÜKLEME EKRANI PERDESİ */}
            {phase !== "complete" && (
                <motion.div
                    className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
                    // KRİTİK DEĞİŞİKLİK: Siyah arka plan yıldız ekranı kaplayana kadar (ilk 0.6sn) simsiyah kalır,
                    // yıldız ekranı kapladıktan sonra (0.6sn - 1.2sn arası) yavaşça tamamen şeffaf olur.
                    animate={{
                        backgroundColor: phase === "expanding"
                            ? ["rgba(11, 12, 16, 1)", "rgba(11, 12, 16, 1)", "rgba(11, 12, 16, 0)"]
                            : "rgba(11, 12, 16, 1)"
                    }}
                    transition={
                        phase === "expanding"
                            ? { duration: 1.4, ease: [0.76, 0, 0.24, 1], times: [0, 0.4, 1] }
                            : { duration: 6, repeat: Infinity, ease: "linear" }
                    }
                >
                    {/* Arka Plandaki Parlama (Glow) */}
                    {phase === "loading" && (
                        <div className="absolute w-48 h-48 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    )}

                    {/* Yıldız Katmanları */}
                    <div className="relative flex items-center justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">

                        {/* 1. EN İÇTEKİ BEYAZ YILDIZ (Ekranı yırtacak olan ana parça) */}
                        <motion.div
                            className="absolute aspect-square w-[60px] bg-white rounded-sm"
                            style={{ clipPath: starClipPath }}
                            animate={{
                                // Patlama anında ölçeği 350 katına çıkarıyoruz ki boşluk kalmasın, ekranı tamamen beyaz kaplasın
                                scale: phase === "expanding" ? [1, 350, 350] : 1,
                                rotate: phase === "expanding" ? [0, 360, 720] : 360,
                                // En önemli kısım: Yıldız büyürken opaklığı 1 kalır (ekranı kaplar), 
                                // ekran kapandıktan sonra yavaşça silinir (0 -> şeffaf)
                                opacity: phase === "expanding" ? [1, 1, 0] : 1
                            }}
                            transition={{
                                duration: 1.2,
                                ease: [0.76, 0, 0.24, 1],
                                times: [0, 0.5, 1]
                            }}
                        />

                        {/* 2. DIŞTAKİ RENKLİ YILDIZLAR (Patlama anında merkeze gömülüp yok olurlar) */}
                        {[
                            { size: "w-[75px]", color: "bg-white/40", delay: 0.1 },
                            { size: "w-[90px]", color: "bg-primary/60", delay: 0.2 },
                            { size: "w-[105px]", color: "bg-primary/30", delay: 0.3 },
                        ].map((layer, i) => (
                            <motion.div
                                key={i}
                                className={`absolute aspect-square ${layer.size} ${layer.color}`}
                                style={{ clipPath: starClipPath }}
                                animate={{
                                    scale: phase === "expanding" ? 0 : 1,
                                    rotate: phase === "expanding" ? -180 : 360,
                                    opacity: phase === "expanding" ? 0 : 1
                                }}
                                transition={
                                    phase === "expanding"
                                        ? { duration: 0.4, ease: "easeIn" }
                                        : { duration: 6, repeat: Infinity, ease: "linear", delay: layer.delay }
                                }
                            />
                        ))}
                    </div>

                    {/* Yükleniyor Yazısı */}
                    <motion.div
                        animate={{ opacity: phase === "expanding" ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute mt-48 text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]"
                    >
                        Sistem Yükleniyor...
                    </motion.div>
                </motion.div>
            )}

            {/* ASIL SİTE İÇERİĞİ (ARKA PLAN) */}
            <motion.div
                animate={{
                    // Yıldız ekranı tam kapladığı an (0.5sn sonra) site arkada %100 görünür olur
                    opacity: phase === "loading" ? 0 : 1,
                    scale: phase === "loading" ? 0.96 : 1,
                    filter: phase === "loading" ? "blur(15px)" : "blur(0px)"
                }}
                transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: phase === "expanding" ? 0.4 : 0 // Yıldız tam ekranı kaplayınca akış başlar
                }}
                className="w-full min-h-screen flex flex-col relative z-10"
            >
                {children}
            </motion.div>
        </div>
    );
}