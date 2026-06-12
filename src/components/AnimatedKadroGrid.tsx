"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerCard from "@/components/PlayerCard"; // Kart tasarımı artık burada

interface AnimatedKadroGridProps {
    players: any[];
    agents: any[];
}

// Unvan Sıralama Öncelikleri
const ROLE_PRIORITY: Record<string, number> = {
    "KAPTAN": 1,
    "KOÇ": 2,
    "OYUNCU": 3,
    "YEDEK": 4
};

export default function AnimatedKadroGrid({ players, agents }: AnimatedKadroGridProps) {
    const [activeFilter, setActiveFilter] = useState<string>("Tümü");

    // Oyuncuların oynadığı ajanların rollerini benzersiz (unique) bir liste haline getir
    const availableRoles = useMemo(() => {
        const roles = new Set<string>();
        roles.add("Tümü");
        players.forEach(player => {
            const agent = agents.find(a => a.displayName === player.favoriteAgent);
            if (agent?.role?.displayName) {
                roles.add(agent.role.displayName);
            }
        });
        return Array.from(roles);
    }, [players, agents]);

    // Seçili filtreye göre oyuncuları listele ve KAPTAN > KOÇ şeklinde sırala
    const filteredAndSortedPlayers = useMemo(() => {
        let result = players;

        // Önce Filtrele
        if (activeFilter !== "Tümü") {
            result = players.filter(player => {
                const agent = agents.find(a => a.displayName === player.favoriteAgent);
                return agent?.role?.displayName === activeFilter;
            });
        }

        // Sonra Unvana Göre Sırala
        return result.sort((a, b) => {
            const priorityA = ROLE_PRIORITY[a.teamRole || "OYUNCU"] || 5;
            const priorityB = ROLE_PRIORITY[b.teamRole || "OYUNCU"] || 5;
            return priorityA - priorityB;
        });
    }, [activeFilter, players, agents]);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Cam Efektli Filtreleme Menüsü (Senin Orijinal Tasarımın) */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 p-2 bg-white/5 dark:bg-gray-900/30 backdrop-blur-xl border border-white/10 dark:border-gray-800/50 rounded-full">
                {availableRoles.map((role) => (
                    <button
                        key={role}
                        onClick={() => setActiveFilter(role)}
                        className={`relative px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${activeFilter === role
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {activeFilter === role && (
                            <motion.div
                                layoutId="active-filter-pill"
                                className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_15px_var(--primary)]"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 uppercase tracking-wider">{role}</span>
                    </button>
                ))}
            </div>

            {/* Animasyonlu Kart Grid'i */}
            <motion.div
                layout // Bu satır sayesinde kartlar yer değiştirirken kayarak hareket eder
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full"
            >
                <AnimatePresence mode="popLayout">
                    {filteredAndSortedPlayers.map((player) => {
                        const playerAgent = agents.find((a: any) => a.displayName === player.favoriteAgent);

                        return (
                            <motion.div
                                key={player.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PlayerCard player={player} agent={playerAgent} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}