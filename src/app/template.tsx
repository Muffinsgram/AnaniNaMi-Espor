"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.main
            // Sayfa ilk render edildiğinde şeffaf ve biraz aşağıda başlasın
            initial={{ opacity: 0, y: 20 }}

            // Animasyonla tam görünür ve orijinal pozisyonuna gelsin
            animate={{ opacity: 1, y: 0 }}

            // Animasyonun süresi ve yumuşaklığı (easing)
            transition={{ ease: "easeInOut", duration: 0.5 }}

            // İçeriğin tam oturması için gerekli ana kapsayıcı sınıflar
            className="w-full min-h-screen"
        >
            {children}
        </motion.main>
    );
}