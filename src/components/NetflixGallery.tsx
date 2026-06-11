"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Flame, Target, Crosshair } from "lucide-react";

// Tag'lere göre ikon belirleme
const getTagIcon = (tag: string) => {
    switch (tag.toUpperCase()) {
        case "ACE": return <Flame size={14} className="text-orange-500" />;
        case "CLUTCH": return <Target size={14} className="text-primary" />;
        default: return <Crosshair size={14} className="text-emerald-500" />;
    }
};

export default function NetflixGallery({ clips }: { clips: any[] }) {
    const [selectedClip, setSelectedClip] = useState<string | null>(null);

    if (!clips || clips.length === 0) return null;

    return (
        <div className="w-full py-12">
            <div className="max-w-6xl mx-auto px-4 mb-6 flex items-center justify-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Flame className="text-primary" /> Haftanın <span className="text-primary">Klipleri</span>
                </h2>
            </div>

            {/* YATAY SLIDER (Netflix Scroll Mantığı) */}
            <div className="w-full overflow-x-auto custom-scrollbar pb-8 pt-4">
                <div className="flex gap-4 justify-center flex-wrap">
                    {clips.map((clip) => (
                        <motion.div
                            key={clip.id}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="group relative w-[280px] md:w-[320px] aspect-video bg-[#1a1c23] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5 hover:border-primary/50 transition-colors"
                            onClick={() => setSelectedClip(clip.youtubeId)}
                        >
                            {/* YouTube Yüksek Çözünürlüklü Kapak Fotoğrafı */}
                            <img
                                src={`https://img.youtube.com/vi/${clip.youtubeId}/maxresdefault.jpg`}
                                alt={clip.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Karanlık Gradyan ve Play Butonu */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-center justify-center">
                                <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,70,85,0.6)]">
                                    <Play size={24} className="text-white ml-1" fill="currentColor" />
                                </div>
                            </div>

                            {/* Alt Bilgi */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                        {getTagIcon(clip.tag)} {clip.tag}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold text-sm truncate drop-shadow-md">{clip.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* SİNEMATİK VİDEO MODALI (Tıklanınca Açılan Tiyatro Modu) */}
            <AnimatePresence>
                {selectedClip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setSelectedClip(null)}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,70,85,0.2)] border border-white/10"
                        >
                            {/* Autoplay açık ve kontroller minimal */}
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedClip}?autoplay=1&rel=0&modestbranding=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}