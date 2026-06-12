"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAnnouncements } from "@/app/actions/announcement";
import { getClips } from "@/app/actions/clipActions";
import AnnouncementPanel from "@/components/AnnouncementPanel";
import NetflixGallery from "@/components/NetflixGallery";
import { Play, Star, X } from "lucide-react"; // İkonlar eklendi

export default function Home() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [clips, setClips] = useState<any[]>([]);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false); // Günün klibi modalı için state

  useEffect(() => {
    async function fetchData() {
      try {
        const [announcementsData, clipsData] = await Promise.all([
          getAnnouncements(),
          getClips()
        ]);
        setAnnouncements(announcementsData.slice(0, 4));
        setClips(clipsData);
      } catch (error) {
        console.error("Veriler çekilemedi:", error);
      }
    }
    fetchData();
  }, []);

  // Klipleri ikiye ayırıyoruz: Biri yıldızlı olan (Kral), diğeri geri kalanlar (Halk)
  const featuredClip = clips.find(c => c.isFeatured);
  const galleryClips = clips.filter(c => !c.isFeatured);

  return (
    <main className="w-full flex flex-col items-center justify-start pt-32 px-4 pb-24 text-center min-h-screen">

      {/* GÜNÜN KLİBİ VİDEO MODALI (Sadece yıldıza tıklandığında açılır) */}
      <AnimatePresence>
        {isFeaturedOpen && featuredClip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsFeaturedOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors z-50"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,70,85,0.3)] border border-white/10 relative"
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${featuredClip.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title="Featured Clip"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÜST KISIM: KAHRAMAN (HERO) KARTI */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-12 rounded-[2.5rem] shadow-2xl max-w-3xl w-full transition-colors duration-500"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm mb-6 transition-colors duration-300"
        >
          Premier Sezonu Başlıyor 🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          Yeni Nesil <span className="text-primary transition-colors duration-300">E-Spor</span> Deneyimi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Takımımızın güncel kadrosunu incele, yaklaşan antrenmanları takip et ve taktik odasında yerini al.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <button>
            <a href="https://discord.gg/cPjJdfbajV" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary/25 duration-300 inline-block">
              Discord Sunucumuza Katıl
            </a>
          </button>
          <button onClick={() => window.location.href = "/fikstur"} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-sm">
            Maçları İncele
          </button>
        </motion.div>
      </motion.div>

      {/* YENİ: GÜNÜN KLİBİ (SİNEMATİK BANNER) */}
      {featuredClip && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full max-w-5xl mt-16 px-4"
        >
          <div
            onClick={() => setIsFeaturedOpen(true)}
            className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden cursor-pointer group shadow-[0_0_40px_rgba(255,70,85,0.15)] hover:shadow-[0_0_60px_rgba(255,70,85,0.3)] transition-all duration-500 border border-white/10 hover:border-primary/50 bg-[#0B0C10]"
          >
            {/* YouTube Thumbnail Kapak Fotoğrafı */}
            <img
              src={`https://img.youtube.com/vi/${featuredClip.youtubeId}/maxresdefault.jpg`}
              alt={featuredClip.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            />

            {/* Karartma Gradyanı */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Merkezdeki Dev Play Butonu */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/90 rounded-full flex items-center justify-center scale-90 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,70,85,0.6)]">
                <Play size={40} className="text-white ml-2" fill="currentColor" />
              </div>
            </div>

            {/* Sol Alt Bilgi Kısmı */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-left w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  <Star size={14} fill="currentColor" /> Günün Klibi
                </span>
                <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white uppercase tracking-widest border border-white/10">
                  {featuredClip.tag}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg truncate w-full max-w-3xl">
                {featuredClip.title}
              </h2>
            </div>
          </div>
        </motion.div>
      )}

      {/* ORTA KISIM: NETFLIX TARZI KLİP GALERİSİ (Kalan klipleri gösterir) */}
      {galleryClips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
          className="w-full mt-12"
        >
          <NetflixGallery clips={galleryClips} />
        </motion.div>
      )}

      {/* ALT KISIM: DUYURULAR BÖLÜMÜ */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
          className="mt-12 w-full max-w-3xl text-left"
        >
          <AnnouncementPanel announcements={announcements} userRole="USER" />
        </motion.div>
      )}

    </main>
  );
}