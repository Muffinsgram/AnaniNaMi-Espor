"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldAlert, Zap } from "lucide-react";
import ColorPicker from "./ColorPicker";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 w-full flex justify-center pt-4 px-4 z-[100] pointer-events-none">

            {/* ANA KAPSÜL NAVBAR */}
            <nav className="pointer-events-auto w-full max-w-5xl bg-white/70 dark:bg-[#0B0C10]/70 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full py-3 px-6 flex justify-between items-center shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 relative z-50">

                {/* LOGO (Neon Hover Efektli) */}
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="group text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                    Anani<span className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]">Na'Mi</span>
                </Link>

                {/* MASAÜSTÜ MENÜ */}
                <div className="hidden md:flex gap-8 items-center font-medium text-sm text-gray-700 dark:text-gray-300">

                    {/* Alt Çizgili Kayan Link Efekti */}
                    <Link href="/kadro" className="group relative px-2 py-1">
                        <span className="relative z-10 uppercase tracking-widest text-xs font-bold transition-colors duration-300 group-hover:text-primary">Kadro</span>
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 origin-right group-hover:origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full"></span>
                    </Link>

                    <Link href="/fikstur" className="group relative px-2 py-1">
                        <span className="relative z-10 uppercase tracking-widest text-xs font-bold transition-colors duration-300 group-hover:text-primary">Maçlar</span>
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 origin-right group-hover:origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full"></span>
                    </Link>

                    {/* Taktik Odası (Işık Yansıma Efektli VIP Buton) */}
                    {session && (
                        <Link href="/taktik-odasi" className="group relative overflow-hidden text-primary px-5 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/50 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></span>
                            <ShieldAlert size={14} className="group-hover:scale-110 transition-transform duration-300" />
                            <span className="relative z-10">Taktik Odası</span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hover:scale-110 transition-transform duration-300">
                        <ColorPicker />
                    </div>

                    {session ? (
                        <ProfileDropdown />
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => signIn("discord")}
                            className="hidden md:flex items-center gap-2 text-sm font-black bg-primary text-white px-6 py-2 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.6)] uppercase tracking-widest relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                            <Zap size={16} className="relative z-10 group-hover:animate-pulse" />
                            <span className="relative z-10">Giriş</span>
                        </motion.button>
                    )}

                    {/* MOBİL HAMBURGER BUTONU (Yaylanma Animasyonlu) */}
                    <motion.button
                        whileTap={{ scale: 0.8, rotate: 90 }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 rounded-full border border-transparent dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.button>
                </div>
            </nav>

            {/* MOBİL AÇILIR ÇEKMECE */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pointer-events-auto absolute top-20 left-4 right-4 bg-white/90 dark:bg-[#0B0C10]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 md:hidden z-40"
                    >
                        <div className="flex flex-col gap-4">
                            <Link href="/kadro" onClick={() => setIsMobileMenuOpen(false)} className="group text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white hover:text-primary transition-colors flex items-center justify-between">
                                Kadro <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">→</span>
                            </Link>
                            <Link href="/fikstur" onClick={() => setIsMobileMenuOpen(false)} className="group text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white hover:text-primary transition-colors flex items-center justify-between">
                                Maçlar <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">→</span>
                            </Link>

                            {session && (
                                <Link href="/taktik-odasi" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-black uppercase tracking-wider text-xl flex items-center gap-2 mt-2 bg-primary/10 p-4 rounded-xl border border-primary/20 active:scale-95 transition-transform">
                                    <ShieldAlert size={20} /> Taktik Odası
                                </Link>
                            )}
                        </div>

                        {!session && (
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10 mt-2">
                                <button onClick={() => { setIsMobileMenuOpen(false); signIn("discord"); }} className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-primary hover:bg-primary/90 text-white py-4 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 transition-all">
                                    <Zap size={18} /> Discord İle Giriş
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
}