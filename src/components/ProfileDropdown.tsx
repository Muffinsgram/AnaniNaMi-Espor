"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, Link as LinkIcon, Settings, ShieldAlert, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
                aria-label="Profil Menüsünü Aç"
            >
                <img
                    src={session.user?.image || ""}
                    alt="Profil"
                    className="w-10 h-10 rounded-full border-2 border-primary transition-colors duration-300 object-cover shadow-sm"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-56 origin-top-right bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >

                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {session.user?.name}
                            </p>
                            <p className="text-xs text-primary font-medium mt-0.5 truncate">
                                Yeni Üye
                            </p>
                        </div>

                        <div className="p-2 space-y-1">
                            <Link onClick={() => setIsOpen(false)} href="/profilim" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                                <User size={18} />
                                Profilim
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/tracker-bagla" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                                <LinkIcon size={18} />
                                Riot ID Bağla
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/ayarlar" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                                <Settings size={18} />
                                Ayarlar
                            </Link>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                            <Link onClick={() => setIsOpen(false)} href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                                <ShieldAlert size={18} />
                                Admin Paneli
                            </Link>

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1"
                            >
                                <LogOut size={18} />
                                Çıkış Yap
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}