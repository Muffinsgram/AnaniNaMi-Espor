"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Users, ShieldCheck, UserX, UserCheck, Gamepad2, Loader2, Sword, Calendar, Plus, Trash2, MapPin, Trophy, Save, X, Image as ImageIcon } from "lucide-react";
import { togglePlayerRole } from "@/app/actions/adminActions";
import { getAnnouncements } from "@/app/actions/announcement";
import { getMatches, createMatch, deleteMatch, updateMatchScore } from "@/app/actions/matchActions";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import { toast } from "sonner";

const VALORANT_MAPS = [
    { name: "Ascent", img: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png" },
    { name: "Bind", img: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png" },
    { name: "Haven", img: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png" },
    { name: "Split", img: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png" },
    { name: "Lotus", img: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png" },
    { name: "Sunset", img: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png" },
    { name: "Abyss", img: "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/listviewicontall.png" },
    { name: "Icebox", img: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png" },
    { name: "Pearl", img: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png" },
    { name: "Breeze", img: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicontall.png" },
    { name: "Fracture", img: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicontall.png" }
];

const FALLBACK_IMAGE = "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7b0f697dbaf2b719/60ee59955e82a01290356bc0/Valorant_Key_Art_1920x1080.jpg";

export default function AdminPanel() {
    const { data: session, status } = useSession();

    const [users, setUsers] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [matchLoading, setMatchLoading] = useState(false);

    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<string>("");

    const [scoreInputs, setScoreInputs] = useState<{ [key: string]: string }>({});
    const [statusInputs, setStatusInputs] = useState<{ [key: string]: string }>({});

    const ADMIN_EMAIL = "hozpinar419@gmail.com";

    useEffect(() => {
        async function fetchData() {
            try {
                const [resUsers, dataAnnouncements, dataMatches] = await Promise.all([
                    fetch("/api/admin/users"),
                    getAnnouncements(),
                    getMatches()
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                setAnnouncements(dataAnnouncements);
                setMatches(dataMatches);

                const sInputs: any = {};
                const stInputs: any = {};
                dataMatches.forEach((m: any) => {
                    sInputs[m.id] = m.score || "0-0";
                    stInputs[m.id] = m.status || "UPCOMING";
                });
                setScoreInputs(sInputs);
                setStatusInputs(stInputs);

            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {
                setLoading(false);
            }
        }
        if (session?.user?.email === ADMIN_EMAIL) fetchData();
        else if (status !== "loading") setLoading(false);
    }, [session, status]);

    const handleToggleRole = async (userId: string, currentRole: string) => {
        setActionLoading(userId);
        const res = await togglePlayerRole(userId, currentRole);
        if (res.success) setUsers(users.map(u => u.id === userId ? { ...u, teamRole: res.newRole } : u));
        else toast.error(res.error);
        setActionLoading(null);
    };

    const handleAddMatch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedMap) return toast.error("Lütfen önce bir harita seçin!");

        setMatchLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await createMatch({
                opponent: formData.get("opponent") as string,
                date: new Date(formData.get("date") as string),
                map: selectedMap,
            });
            toast.success("Maç başarıyla planlandı!");
            e.currentTarget.reset();
            setSelectedMap("");

            const updatedMatches = await getMatches();
            setMatches(updatedMatches);

            const sInputs: any = { ...scoreInputs };
            const stInputs: any = { ...statusInputs };
            updatedMatches.forEach((m: any) => {
                if (!sInputs[m.id]) sInputs[m.id] = m.score || "0-0";
                if (!stInputs[m.id]) stInputs[m.id] = m.status || "UPCOMING";
            });
            setScoreInputs(sInputs);
            setStatusInputs(stInputs);
        } catch { toast.error("Maç eklenirken hata oluştu."); }
        finally { setMatchLoading(false); }
    };

    const handleDeleteMatch = async (id: string) => {
        await deleteMatch(id);
        setMatches(matches.filter(m => m.id !== id));
        toast.success("Maç komuta merkezinden silindi.");
    };

    const handleSaveScore = async (id: string) => {
        try {
            await updateMatchScore(id, scoreInputs[id] || "0-0", statusInputs[id] || "UPCOMING");
            toast.success("Skor ve Durum Güncellendi!");
            setMatches(matches.map(m => m.id === id ? { ...m, score: scoreInputs[id], status: statusInputs[id] } : m));
        } catch {
            toast.error("Güncelleme başarısız.");
        }
    };

    if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    if (session?.user?.email !== ADMIN_EMAIL) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
            <ShieldAlert size={64} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Gizli Bölge</h1>
            <p className="text-gray-500">Bu sayfaya sadece Takım Kaptanı erişebilir.</p>
        </div>
    );

    return (
        <main className="w-full min-h-screen pt-32 px-4 pb-24 relative">

            <AnimatePresence>
                {isMapModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#0B0C10] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-white flex items-center gap-3"><ImageIcon className="text-primary" /> Harita Seç</h3>
                                <button onClick={() => setIsMapModalOpen(false)} className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-2xl transition-all"><X size={20} /></button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                                {VALORANT_MAPS.map((m) => (
                                    <div key={m.name} onClick={() => { setSelectedMap(m.name); setIsMapModalOpen(false); }} className={`group relative h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedMap === m.name ? 'border-primary shadow-[0_0_20px_rgba(255,70,85,0.4)] scale-[1.02]' : 'border-transparent hover:border-white/30 hover:scale-[1.02]'}`}>
                                        <img
                                            src={m.img}
                                            alt={m.name}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${selectedMap !== m.name && 'group-hover:scale-110 opacity-60 group-hover:opacity-100'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <span className={`font-black uppercase tracking-widest ${selectedMap === m.name ? 'text-primary' : 'text-white'}`}>{m.name}</span>
                                            {selectedMap === m.name && <div className="bg-primary text-white rounded-full p-1 animate-pulse"><MapPin size={14} /></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto space-y-12">

                <div className="bg-[#0B0C10]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden p-6 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 bg-primary/20 text-primary rounded-xl"><Trophy size={24} /></div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Maç Merkezi</h2>
                    </div>

                    <form onSubmit={handleAddMatch} className="flex flex-col gap-6 mb-10 bg-white/5 p-6 rounded-3xl border border-white/10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Rakip Takım</label>
                                <input name="opponent" placeholder="Örn: BBL Esports" className="bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-primary text-white text-sm font-black transition-all" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Tarih & Saat</label>
                                <input name="date" type="datetime-local" className="bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-primary text-white text-sm font-bold transition-all" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Harita</label>
                                <button type="button" onClick={() => setIsMapModalOpen(true)} className={`p-4 rounded-xl border outline-none transition-all flex items-center justify-between text-sm ${selectedMap ? 'bg-primary/20 border-primary text-primary font-black' : 'bg-black/50 border-white/10 hover:border-primary text-gray-400 font-bold'}`}>
                                    {selectedMap ? selectedMap.toUpperCase() : "HARİTA SEÇİNİZ"}
                                    <MapPin size={18} className={selectedMap ? "text-primary" : "text-gray-400"} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end mt-2 border-t border-white/10 pt-6">
                            <button disabled={matchLoading} className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,70,85,0.3)] w-full md:w-auto uppercase tracking-widest">
                                {matchLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />} Maçı Planla
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4 relative z-10">
                        {matches.length === 0 ? (
                            <div className="text-center p-8 border border-dashed border-white/20 rounded-3xl text-gray-400 font-medium bg-black/20">Henüz planlanmış bir maç yok.</div>
                        ) : (
                            matches.map((m) => {
                                const mapBg = VALORANT_MAPS.find(v => v.name === m.map)?.img || FALLBACK_IMAGE;

                                return (
                                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group flex flex-col lg:flex-row items-center gap-6 rounded-3xl border border-white/10 shadow-sm relative overflow-hidden bg-black min-h-[100px]">

                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={mapBg}
                                                alt="Map"
                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                                                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60"></div>
                                        </div>

                                        <div className={`absolute left-0 top-0 bottom-0 w-2 z-20 ${statusInputs[m.id] === 'LIVE' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : statusInputs[m.id] === 'COMPLETED' ? 'bg-primary' : 'bg-gray-600'}`} />

                                        <div className="flex-1 pl-8 py-6 flex items-center gap-4 relative z-10 w-full">
                                            <div>
                                                <h3 className="text-2xl font-black text-white uppercase tracking-wider">{m.opponent}</h3>
                                                <div className="flex gap-4 text-xs text-gray-400 font-bold mt-2">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {new Date(m.date).toLocaleString("tr-TR", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {m.map}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 relative z-10 pr-6 py-6 w-full lg:w-auto justify-end bg-black/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0">

                                            <select value={statusInputs[m.id]} onChange={(e) => setStatusInputs({ ...statusInputs, [m.id]: e.target.value })} className={`p-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none border transition-colors cursor-pointer ${statusInputs[m.id] === 'LIVE' ? 'bg-red-500/20 text-red-500 border-red-500/50' : statusInputs[m.id] === 'COMPLETED' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'}`}>
                                                <option value="UPCOMING" className="bg-black">YAKLAŞIYOR</option>
                                                <option value="LIVE" className="bg-black text-red-500">CANLI</option>
                                                <option value="COMPLETED" className="bg-black text-primary">TAMAMLANDI</option>
                                            </select>

                                            <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-white/10 shadow-inner">
                                                <input value={scoreInputs[m.id] || ""} onChange={(e) => setScoreInputs({ ...scoreInputs, [m.id]: e.target.value })} placeholder="0 - 0" className="w-24 bg-transparent text-center text-2xl font-black text-white outline-none placeholder:text-gray-700" />
                                            </div>

                                            <button onClick={() => handleSaveScore(m.id)} className="p-4 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all shadow-lg" title="Kaydet"><Save size={20} /></button>
                                            <button onClick={() => handleDeleteMatch(m.id)} className="p-4 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all ml-1" title="Sil"><Trash2 size={20} /></button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. MODÜL: KADRO YÖNETİMİ (KODUN AYNI KALACAK) */}
                <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="text-primary" size={20} /> Kadro Yönetimi
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Oyuncu</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Riot ID & Ajan</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Durum</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {users.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">Bekleyen başvuru yok.</td></tr>
                                ) : (
                                    users.map((user) => (
                                        <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                                                    <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary flex items-center gap-1"><Gamepad2 size={14} /> {user.riotId}</span>
                                                    <span className="text-sm text-gray-500">{user.favoriteAgent}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${user.teamRole === "OYUNCU"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                    }`}>
                                                    {user.teamRole === "OYUNCU" ? "Kadroda" : "Bekliyor"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => handleToggleRole(user.id, user.teamRole)}
                                                    disabled={actionLoading === user.id}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${user.teamRole === "OYUNCU"
                                                        ? "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white"
                                                        : "bg-primary hover:bg-primary-hover text-white"
                                                        }`}
                                                >
                                                    {actionLoading === user.id ? <Loader2 size={16} className="animate-spin" /> :
                                                        user.teamRole === "OYUNCU" ? <><UserX size={16} /> Çıkar</> : <><UserCheck size={16} /> Ekle</>}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AdminAnnouncements initialAnnouncements={announcements} />

            </div>
        </main>
    );
}