"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FaTwitter, FaTwitch, FaInstagram, FaKickstarter, FaYoutube, FaTiktok, FaGlobe } from "react-icons/fa";

// iconMap'i dışa aktarmak için başına "export" ekledik
export const iconMap: any = {
    twitter: FaTwitter,
    twitch: FaTwitch,
    instagram: FaInstagram,
    kick: FaKickstarter,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    other: FaGlobe
};

export default function SocialSelector({ onSelect }: { onSelect: (platform: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:bg-white/5 p-2 rounded-xl transition-all">
                <Plus size={16} /> Yeni Platform Ekle
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute left-0 mt-2 p-3 bg-[#0B0C10] border border-white/10 rounded-2xl shadow-2xl z-50 flex gap-2"
                    >
                        {Object.keys(iconMap).map((platform) => {
                            const Icon = iconMap[platform];
                            return (
                                <button key={platform} type="button" onClick={() => { onSelect(platform); setIsOpen(false); }} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white">
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}