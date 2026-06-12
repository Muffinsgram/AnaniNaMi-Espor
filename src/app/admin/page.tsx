"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Users, ShieldCheck, UserX, UserCheck, Gamepad2, Loader2, Sword, Calendar, Plus, Trash2, MapPin, Trophy, Save, X, Image as ImageIcon, Play, Film, Star, Edit3, ChevronDown } from "lucide-react";
import { updatePlayerRole } from "@/app/actions/adminActions";
import { getAnnouncements } from "@/app/actions/announcement";
import { getMatches, createMatch, deleteMatch, updateMatchScore } from "@/app/actions/matchActions";
import { getClips, deleteClip, toggleFeaturedClip, updateClip } from "@/app/actions/clipActions";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AddClipForm from "@/components/AddClipForm";
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

// UNVAN SEÇENEKLERİ VE GÖRSEL AYARLARI
const ROLE_OPTIONS = [
    { value: "ÜYE", label: "ÜYE (BEKLEMEDE)", icon: "👤", color: "text-gray-400", bg: "bg-white/5 border-white/10 hover:bg-white/10" },
    { value: "OYUNCU", label: "OYUNCU", icon: "🎮", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:bg-emerald-500/20" },
    { value: "KAPTAN", label: "KAPTAN", icon: "👑", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:bg-yellow-500/20" },
    { value: "KOÇ", label: "KOÇ", icon: "🧠", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:bg-purple-500/20" },
    { value: "YEDEK", label: "YEDEK", icon: "⏳", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-blue-500/20" }
];

export default function AdminPanel() {
    const { data: session, status } = useSession();

    const [users, setUsers] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [clips, setClips] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [matchLoading, setMatchLoading] = useState(false);

    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<string>("");

    const [scoreInputs, setScoreInputs] = useState<{ [key: string]: string }>({});
    const [statusInputs, setStatusInputs] = useState<{ [key: string]: string }>({});

    const [editingClip, setEditingClip] = useState<any | null>(null);

    // YENİ: Rol seçimi yapılacak oyuncunun verisini tutan popup state'i
    const [roleModalUser, setRoleModalUser] = useState<any | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [resUsers, dataAnnouncements, dataMatches, dataClips] = await Promise.all([
                    fetch("/api/admin/users"),
                    getAnnouncements(),
                    getMatches(),
                    getClips()
                ]);

                if (resUsers.ok) setUsers(await resUsers.json());
                setAnnouncements(dataAnnouncements);
                setMatches(dataMatches);
                setClips(dataClips);

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

        if ((session?.user as any)?.isAdmin) {
            fetchData();
        } else if (status !== "loading") {
            setLoading(false);
        }
    }, [session, status]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setActionLoading(userId);
        const res = await updatePlayerRole(userId, newRole);
        if (res.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, teamRole: newRole } : u));
            toast.success("Kadro unvanı başarıyla güncellendi! 🎯");
        } else {
            toast.error(res.error || "Hata oluştu.");
        }
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

    const handleDeleteClip = async (id: string) => {
        const res = await deleteClip(id);
        if (res?.success) {
            setClips(clips.filter(c => c.id !== id));
            toast.success("Klip başarıyla yayından kaldırıldı.");
        } else toast.error("Klip silinirken hata oluştu.");
    };

    const handleToggleStar = async (id: string, currentStatus: boolean) => {
        const res = await toggleFeaturedClip(id, currentStatus);
        if (res?.success) {
            setClips(clips.map(c => ({ ...c, isFeatured: c.id === id ? !currentStatus : false })));
            toast.success(!currentStatus ? "Sahne Işıkları bu klibe çevrildi! 🌟" : "Günün Klibi etiketi kaldırıldı.");
        } else toast.error("İşlem başarısız.");
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await updateClip(editingClip.id, formData);

        if (res?.success) {
            toast.success("Klip başarıyla güncellendi!");
            setEditingClip(null);
            const updatedClips = await getClips();
            setClips(updatedClips);
        } else toast.error(res?.error || "Hata oluştu.");
    };

    if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    if (!(session?.user as any)?.isAdmin) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
            <ShieldAlert size={64} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-black text-white mb-2">Gizli Bölge</h1>
            <p className="text-gray-500">Bu sayfaya sadece yetkili kişiler erişebilir.</p>
        </div>
    );

    return (
        <main className="w-full min-h-screen pt-32 px-4 pb-24 relative">

            {/* YENİ: KADRO UNVAN SEÇİM MODALI (POPUP) */}
            <AnimatePresence>
                {roleModalUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#1a1c23] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_50px_rgba(255,70,85,0.15)] relative">
                            <button onClick={() => setRoleModalUser(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>

                            <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2"><ShieldCheck className="text-primary" /> Unvan Ata</h3>
                            <p className="text-sm text-gray-400 mb-6"><span className="text-white font-bold">{roleModalUser.name}</span> için yeni rol seçin.</p>

                            <div className="flex flex-col gap-3">
                                {ROLE_OPTIONS.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => {
                                            handleRoleChange(roleModalUser.id, role.value);
                                            setRoleModalUser(null); // Seçimden sonra kapat
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all border ${role.color} ${roleModalUser.teamRole === role.value
                                                ? role.bg.replace('hover:', '') + ' ring-2 ring-white/20 scale-[1.02]'
                                                : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 hover:scale-[1.02]'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="text-xl">{role.icon}</span>
                                            {role.label}
                                        </span>
                                        {roleModalUser.teamRole === role.value && <ShieldCheck size={20} className="text-current" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* KLİP DÜZENLEME MODALI */}
            <AnimatePresence>
                {editingClip && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#1a1c23] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[0_0_50px_rgba(255,70,85,0.15)] relative">
                            <button onClick={() => setEditingClip(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2"><Edit3 className="text-primary" /> Klibi Düzenle</h3>

                            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Klip Başlığı</label>
                                    <input name="title" defaultValue={editingClip.title} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" required />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">YouTube Linki</label>
                                    <input name="url" defaultValue={`https://youtube.com/watch?v=${editingClip.youtubeId}`} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" required />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Kategori</label>
                                    <select name="tag" defaultValue={editingClip.tag} className="bg-[#111217] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                                        <option value="CLUTCH">CLUTCH</option>
                                        <option value="ACE">ACE</option>
                                        <option value="HIGHLIGHT">HIGHLIGHT</option>
                                        <option value="KOMİK">KOMİK / TROLL</option>
                                    </select>
                                </div>
                                <button type="submit" className="mt-4 py-3.5 bg-primary hover:bg-primary/90 text-white font-black rounded-xl uppercase tracking-widest shadow-lg">Değişiklikleri Kaydet</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HARİTA SEÇİM MODALI */}
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

                {/* 1. MODÜL: MAÇ MERKEZİ */}
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

                {/* 2. MODÜL: KADRO YÖNETİMİ */}
                <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="text-primary" size={20} /> Kadro Yönetimi
                        </h2>
                    </div>
                    {/* Taşma sorununu çözdük, popup artık ekranın ortasında açılıyor */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Oyuncu</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Riot ID & Ajan</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Unvan / Durum</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {users.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">Bekleyen başvuru yok.</td></tr>
                                ) : (
                                    users.map((user) => {
                                        const activeRole = ROLE_OPTIONS.find(r => r.value === (user.teamRole || "ÜYE")) || ROLE_OPTIONS[0];

                                        return (
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

                                                {/* YENİ: BASİT VE ŞIK BUTON (Tıklanınca Popup Açar) */}
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() => setRoleModalUser(user)}
                                                        disabled={actionLoading === user.id}
                                                        className={`w-40 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest outline-none border transition-all duration-300 shadow-lg mx-auto hover:scale-[1.02] ${activeRole.bg} ${activeRole.color}`}
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <Loader2 size={14} className="animate-spin text-current" />
                                                        ) : (
                                                            <>
                                                                <span>{activeRole.icon}</span>
                                                                {activeRole.label}
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => window.open(`/oyuncu/${user.id}`, '_blank')}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                                                    >
                                                        <Play size={12} fill="currentColor" /> Profili İncele
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. MODÜL: DUYURULAR */}
                <AdminAnnouncements initialAnnouncements={announcements} />

                {/* 4. MODÜL: MEDYA VE KLİP MERKEZİ */}
                <div className="bg-[#0B0C10]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden p-6 md:p-8 relative">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none"></div>

                    <div className="w-full flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><Play size={24} /></div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Medya Merkezi</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                        <div className="w-full flex justify-center lg:justify-start">
                            <AddClipForm />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col shadow-inner">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Film size={16} /> Yayındaki Klipler ({clips.length})
                            </h3>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
                                {clips.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-gray-500 text-sm font-medium">Henüz yayınlanmış bir klip yok.</div>
                                ) : (
                                    clips.map(clip => (
                                        <motion.div key={clip.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-3 items-center bg-black/40 hover:bg-black/60 p-3 rounded-2xl border transition-colors group ${clip.isFeatured ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/5'}`}>

                                            <div className="relative min-w-[80px] h-14 rounded-xl overflow-hidden border border-white/10">
                                                <img src={`https://img.youtube.com/vi/${clip.youtubeId}/mqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="thumbnail" />
                                                {clip.isFeatured && <div className="absolute top-1 right-1 bg-yellow-500 text-black p-0.5 rounded-full"><Star size={10} fill="currentColor" /></div>}
                                            </div>

                                            <div className="flex-1 overflow-hidden">
                                                <h4 className={`text-sm font-bold truncate ${clip.isFeatured ? 'text-yellow-500' : 'text-white'}`}>{clip.title}</h4>
                                                <span className="text-[10px] text-primary font-black uppercase tracking-widest">{clip.tag}</span>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleToggleStar(clip.id, clip.isFeatured)} className={`p-2 rounded-lg transition-colors ${clip.isFeatured ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'}`} title="Günün Klibi Yap">
                                                    <Star size={16} fill={clip.isFeatured ? "currentColor" : "none"} />
                                                </button>
                                                <button onClick={() => setEditingClip(clip)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Düzenle">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteClip(clip.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Sil">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}