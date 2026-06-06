"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="w-full min-h-[75vh] flex items-center justify-center px-4">

            {/* Cam Efektli Loading Kartı */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center max-w-sm w-full"
            >

                {/* Takım Logosu Animasyonu */}
                <div className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 flex items-center">
                    Anani
                    <motion.span
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            textShadow: ["0px 0px 0px var(--primary)", "0px 0px 20px var(--primary)", "0px 0px 0px var(--primary)"]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-primary ml-0.5"
                    >
                        Na'Mi
                    </motion.span>
                </div>

                {/* Çok Zarif Kayan Yükleme Çizgisi (Apple / Vercel Tarzı) */}
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div
                        className="absolute top-0 bottom-0 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
                        animate={{
                            left: ["-50%", "100%"],
                            width: ["30%", "40%", "30%"]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Nefes Alan Açıklama Metni */}
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-6 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]"
                >
                    Yükleniyor Bekleyiniz...
                </motion.p>

            </motion.div>
        </div>
    );
}