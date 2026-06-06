"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnnouncements } from "@/app/actions/announcement";
import AnnouncementPanel from "@/components/AnnouncementPanel";

export default function Home() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    // Sayfa yüklendiğinde duyuruları veritabanından çekiyoruz
    async function fetchAnnouncements() {
      try {
        const data = await getAnnouncements();
        // Ana sayfada çok fazla kalabalık yapmaması için sadece son 4 duyuruyu gösteriyoruz
        setAnnouncements(data.slice(0, 4));
      } catch (error) {
        console.error("Duyurular çekilemedi:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <main className="w-full flex flex-col items-center justify-start pt-32 px-4 pb-24 text-center min-h-screen">

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
            Fikstürü İncele
          </button>
        </motion.div>
      </motion.div>
      {/* https://discord.gg/bDejPXQFvu */}
      {/* ALT KISIM: DUYURULAR BÖLÜMÜ */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
          className="mt-12 w-full max-w-3xl text-left"
        >
          {/* Ana sayfadaki kullanıcılara yeni duyuru ekleme butonu gözükmemesi için role="USER" gönderiyoruz */}
          <AnnouncementPanel announcements={announcements} userRole="USER" />
        </motion.div>
      )}

    </main>
  );
}