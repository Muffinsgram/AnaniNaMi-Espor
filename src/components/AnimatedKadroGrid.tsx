"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerCard from "@/components/PlayerCard";

interface AnimatedKadroGridProps {
    players: any[];
    agents: any[];
}

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

    // Seçili filtreye göre oyuncuları listele
    const filteredPlayers = useMemo(() => {
        if (activeFilter === "Tümü") return players;
        return players.filter(player => {
            const agent = agents.find(a => a.displayName === player.favoriteAgent);
            return agent?.role?.displayName === activeFilter;
        });
    }, [activeFilter, players, agents]);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Cam Efektli Filtreleme Menüsü */}
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
                    {filteredPlayers.map((player) => {
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