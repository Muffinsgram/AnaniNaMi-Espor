"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Calendar, ChevronRight, Zap, X } from "lucide-react";

export default function AnnouncementPanel({ announcements, userRole }: { announcements: any[], userRole: string }) {
    // Tıklanan duyuruyu hafızada tutmak için state
    const [selectedAnn, setSelectedAnn] = useState<any | null>(null);

    return (
        <div className="w-full relative">
            {/* Arka plan neon parlama efekti */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-purple-500/20 blur-2xl z-0 rounded-3xl opacity-50"></div>

            <div className="relative bg-[#0B0C10]/80 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl z-10 overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                {/* Başlık ve Buton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                            <span className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                <Megaphone className="text-primary" size={28} />
                            </span>
                            Haber Merkezi
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm ml-1">Takımla ilgili en son gelişmeler ve duyurular</p>
                    </div>

                    {userRole === "ADMIN" && (
                        <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                            <Plus size={18} /> Yeni Duyuru
                        </button>
                    )}
                </div>

                {/* Duyuru Kartları (Grid Sistemi) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {announcements.length === 0 ? (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <Zap size={32} className="mb-3 text-gray-600" />
                            <p className="font-medium">Henüz bir duyuru bulunmuyor.</p>
                        </div>
                    ) : (
                        announcements.map((ann, i) => (
                            <motion.div
                                key={ann.id}
                                onClick={() => setSelectedAnn(ann)} // Tıklanınca duyuruyu seç
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 p-6 md:p-8 rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute -inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Üst Bilgi */}
                                <div className="flex justify-between items-center mb-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                                        <Zap size={12} className="fill-primary" /> Güncel
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold bg-black/20 px-3 py-1 rounded-lg">
                                        <Calendar size={14} className="text-gray-500" />
                                        {new Date(ann.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })}
                                    </div>
                                </div>

                                {/* İçerik */}
                                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">{ann.title}</h3>
                                {/* line-clamp-3 sayesinde çok uzunsa 3 satırda kesilir */}
                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">{ann.content}</p>

                                {/* Alt Footer */}
                                <div className="flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-white transition-colors mt-auto pt-4 border-t border-white/5">
                                    <span>Tümünü Oku</span>
                                    <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* OKUMA MODALI (AÇILIR PENCERE) */}
            <AnimatePresence>
                {selectedAnn && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1A1C23] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative max-h-[85vh] overflow-y-auto"
                        >
                            {/* Kapat Butonu */}
                            <button
                                onClick={() => setSelectedAnn(null)}
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal İçeriği */}
                            <div className="flex items-center gap-2 text-primary text-sm font-bold tracking-widest uppercase mb-4">
                                <Calendar size={16} />
                                {new Date(selectedAnn.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
                                {selectedAnn.title}
                            </h2>

                            <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                                {selectedAnn.content}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}