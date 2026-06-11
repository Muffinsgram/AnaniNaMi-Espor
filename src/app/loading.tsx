import React from 'react';

export default function Loading() {
    // Uiverse'deki o özel yıldız şeklini çizen koordinatlar
    const starClipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

    // 5 Farklı katman: Her biri farklı boyutta, farklı renkte ve gecikmeli (delay) dönüyor
    const cracks = [
        { size: "w-[40px] md:w-[60px]", delay: "0s", color: "bg-white" },
        { size: "w-[50px] md:w-[75px]", delay: "-1s", color: "bg-white/80" },
        { size: "w-[60px] md:w-[90px]", delay: "-1.5s", color: "bg-primary/70" },
        { size: "w-[70px] md:w-[105px]", delay: "-2s", color: "bg-primary/40" },
        { size: "w-[80px] md:w-[120px]", delay: "-2.5s", color: "bg-primary/20" },
    ];

    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4">

            {/* Ortadaki Parlama Efekti */}
            <div className="relative flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">

                {/* Yıldızların Döngüsü */}
                {cracks.map((crack, i) => (
                    <div
                        key={i}
                        className={`absolute aspect-square ${crack.size} ${crack.color}`}
                        style={{
                            clipPath: starClipPath,
                            // Tailwind'in varsayılan spin keyframe'ini kullanarak 6 saniyelik dönüş veriyoruz
                            animation: `spin 6s linear infinite`,
                            animationDelay: crack.delay
                        }}
                    />
                ))}

                {/* Arka Planda Glow (Işık Yayılımı) */}
                <div className="absolute w-24 h-24 bg-primary/30 blur-2xl rounded-full animate-pulse" />
            </div>

            {/* Alt Bilgi Metni */}
            <div className="mt-32 text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.4em] animate-pulse">
                AnaniNa'Mi E-Sport
            </div>

        </div>
    );
}