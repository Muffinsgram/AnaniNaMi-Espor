"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Gamepad2, Link as LinkIcon, ShieldAlert, ChevronDown, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { updateProfile } from "@/app/actions/updateProfile";
import { getProfile } from "@/app/actions/getProfile"; // YENİ: Profil kontrol fonksiyonumuz

type Agent = {
    uuid: string;
    displayName: string;
    displayIcon: string;
    role: { displayName: string } | null;
};

type Toast = {
    message: string;
    type: "success" | "error";
} | null;

export default function TrackerBagla() {
    const { data: session } = useSession();
    const [riotId, setRiotId] = useState("");

    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    // Sayfa ilk açıldığında hem ajanları hem profili yüklerken kullanılacak genel yükleme state'i
    const [isInitializing, setIsInitializing] = useState(true);

    const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<Toast>(null);
    const [linkedProfile, setLinkedProfile] = useState<{ riotId: string; agent: Agent } | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // YENİ: Sayfa açıldığında hem ajanları çek hem de kullanıcının veritabanı kaydını kontrol et
    useEffect(() => {
        async function loadInitialData() {
            try {
                // 1. API'den Ajanları Çek
                const res = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=tr-TR");
                const data = await res.json();
                const fetchedAgents = data.data;
                fetchedAgents.sort((a: Agent, b: Agent) => a.displayName.localeCompare(b.displayName));
                setAgents(fetchedAgents);

                // 2. Veritabanından Kullanıcının Profilini Çek
                const dbProfile = await getProfile();

                // 3. Eğer kullanıcı daha önce hesap bağlamışsa, formu atla ve direkt profili göster
                if (dbProfile?.isTrackerLinked && dbProfile.riotId && dbProfile.favoriteAgent) {
                    const savedAgent = fetchedAgents.find((a: Agent) => a.displayName === dbProfile.favoriteAgent) || fetchedAgents[0];
                    setLinkedProfile({ riotId: dbProfile.riotId, agent: savedAgent });
                } else {
                    // Bağlamamışsa varsayılan olarak Jett'i seç ve formu göster
                    const defaultAgent = fetchedAgents.find((a: Agent) => a.displayName === "Jett") || fetchedAgents[0];
                    setSelectedAgent(defaultAgent);
                }
            } catch (error) {
                console.error("Veri yüklenirken hata oluştu:", error);
            } finally {
                setIsInitializing(false); // Yükleme bitti, ekranı göster
            }
        }

        // Sadece oturum açılmışsa bu işlemleri yap
        if (session) {
            loadInitialData();
        }
    }, [session]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsAgentMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAgent) {
            showToast("Lütfen ana ajanınızı seçin!", "error");
            return;
        }
        setLoading(true);

        const result = await updateProfile(riotId, selectedAgent.displayName);

        setLoading(false);

        if (result?.error) {
            showToast(result.error, "error");
        } else {
            showToast("Hesap başarıyla bağlandı!", "success");
            setLinkedProfile({
                riotId: riotId,
                agent: selectedAgent
            });
        }
    };

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center pt-32 px-4">
                <ShieldAlert size={48} className="text-red-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Erişim Engellendi</h2>
                <p className="text-gray-500 mt-2">Bu sayfayı kullanabilmek için önce Discord ile giriş yapmalısınız.</p>
            </div>
        );
    }

    // Veritabanı ve API kontrol edilirken ekranda görünecek tatlı loading ikonu
    if (isInitializing) {
        return (
            <div className="w-full min-h-[85vh] flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Profilin kontrol ediliyor...</p>
            </div>
        );
    }

    return (
        <main className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 relative">

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`fixed top-24 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${toast.type === "success"
                                ? "bg-emerald-50/90 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                                : "bg-red-50/90 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                            }`}
                    >
                        {toast.type === "success" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        <span className="font-semibold">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!linkedProfile ? (
                    <motion.div
                        key="form-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.4 }}
                        className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full mt-12"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-primary/10 rounded-full text-primary shadow-inner">
                                <LinkIcon size={32} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                            Riot ID Bağla
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
                            Oyun içi istatistiklerinin kadro sayfasında görünmesi için hesabını bağla. (Sadece bir kez bağlanabilir)
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                    Riot ID (Örn: Oyuncu#TR1)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Gamepad2 size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={riotId}
                                        onChange={(e) => setRiotId(e.target.value)}
                                        placeholder="KullanıcıAdı#Etiket"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 dark:text-white shadow-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative" ref={menuRef}>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                    Ana Ajanın (Main)
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-all text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={selectedAgent?.displayIcon} alt={selectedAgent?.displayName} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 p-0.5 border border-gray-300 dark:border-gray-600" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-bold text-sm leading-none">{selectedAgent?.displayName}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {selectedAgent?.role?.displayName || "Bilinmeyen Rol"}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isAgentMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {isAgentMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute z-50 w-full mt-2 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-h-72 overflow-y-auto"
                                        >
                                            <div className="grid grid-cols-4 gap-2">
                                                {agents.map((agent) => (
                                                    <button
                                                        key={agent.uuid}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedAgent(agent);
                                                            setIsAgentMenuOpen(false);
                                                        }}
                                                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${selectedAgent?.uuid === agent.uuid
                                                                ? "bg-primary/20 border-2 border-primary"
                                                                : "hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent"
                                                            }`}
                                                    >
                                                        <img src={agent.displayIcon} alt={agent.displayName} className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-200" />
                                                        <span className="text-[10px] font-bold mt-1 text-gray-700 dark:text-gray-300 truncate w-full text-center">
                                                            {agent.displayName}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex justify-center items-center mt-4 text-sm tracking-wide"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        Bağlanıyor...
                                    </span>
                                ) : (
                                    "Hesabı Bağla"
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="profile-view"
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 group mt-12"
                    >
                        <div className="absolute top-0 left-0 w-full h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2"></div>

                        <div className="p-8 flex flex-col items-center text-center relative z-10">

                            <div className="relative mb-6">
                                <img
                                    src={session.user?.image || ""}
                                    alt="Profil"
                                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-xl relative z-10"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-900 z-20" title="Hesap Bağlı">
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                                {session.user?.name}
                            </h2>

                            <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full mb-8">
                                <Gamepad2 size={16} />
                                <span>{linkedProfile.riotId}</span>
                            </div>

                            <div className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between relative overflow-hidden">
                                <div className="flex flex-col items-start text-left z-10">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Kayıtlı Ajan</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{linkedProfile.agent.displayName}</span>
                                    <span className="text-sm text-gray-500">{linkedProfile.agent.role?.displayName}</span>
                                </div>
                                <img
                                    src={linkedProfile.agent.displayIcon}
                                    alt={linkedProfile.agent.displayName}
                                    className="w-16 h-16 drop-shadow-xl group-hover:scale-110 transition-transform duration-500 z-10 relative"
                                />
                            </div>

                            <div className="mt-6 flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed text-left border border-gray-100 dark:border-gray-800">
                                <ShieldAlert size={14} className="shrink-0 mt-0.5 text-primary" />
                                <p>Hesabınız başarıyla takım sistemine kilitlendi. Değişiklik yapmak için takım yöneticiniz ile iletişime geçin.</p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}