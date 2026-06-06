"use client";
import { useColor } from "./ColorProvider";
import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
    { name: "Rose", value: "rose", bg: "bg-rose-500" },
    { name: "Violet", value: "violet", bg: "bg-violet-500" },
    { name: "Emerald", value: "emerald", bg: "bg-emerald-500" },
    { name: "Sky", value: "sky", bg: "bg-sky-500" },
    { name: "Amber", value: "amber", bg: "bg-amber-500" },
];

export default function ColorPicker() {
    const { color, setColor } = useColor();
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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm flex items-center justify-center"
                aria-label="Vurgu Rengini Seç"
            >
                <Palette size={20} />
            </button>

            {/* Menünün açılış ve kapanış animasyonları */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-44 origin-top-right bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                        {colors.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => {
                                    setColor(c.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${color === c.value
                                        ? "bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-white"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 font-medium"
                                    }`}
                            >
                                <span>{c.name}</span>
                                <span className={`w-4 h-4 rounded-full ${c.bg} shadow-md border-2 border-white dark:border-gray-900`} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}