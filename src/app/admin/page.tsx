"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ShieldAlert, Users, ShieldCheck, UserX, UserCheck, Gamepad2, Loader2 } from "lucide-react";
import { togglePlayerRole } from "@/app/actions/adminActions";
import { getAnnouncements } from "@/app/actions/announcement";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";

export default function AdminPanel() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    // KAPTAN (ADMİN) KONTROLÜ
    const ADMIN_EMAIL = "hozpinar419@gmail.com";
    // Kullanıcıları ve Duyuruları Çekme İşlemi
    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Kullanıcıları Çek
                const resUsers = await fetch("/api/admin/users");
                if (resUsers.ok) {
                    const dataUsers = await resUsers.json();
                    setUsers(dataUsers);
                }
                const dataAnnouncements = await getAnnouncements();
                setAnnouncements(dataAnnouncements);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {

                setLoading(false);
            }
        }

        if (session?.user?.email === ADMIN_EMAIL) {
            fetchData();
        } else if (status !== "loading") {
            setLoading(false);
        }
    }, [session, status]);

    const handleToggleRole = async (userId: string, currentRole: string) => {
        setActionLoading(userId);
        const res = await togglePlayerRole(userId, currentRole);
        if (res.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, teamRole: res.newRole } : u));
        } else {
            alert(res.error);
        }
        setActionLoading(null);
    };
    // 1. Durum: Yükleniyor

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    }

    // 2. Durum: Admin Değil
    if (session?.user?.email !== ADMIN_EMAIL) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
                <ShieldAlert size={64} className="text-red-500 mb-6" />
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Gizli Bölge</h1>
                <p className="text-gray-500">Bu sayfaya sadece Takım Kaptanı erişebilir.</p>
            </div>
        );
    }
    // 3. Durum: Admin Girişi Başarılı
    return (
        <main className="w-full min-h-screen pt-32 px-4 pb-24">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Başlık Bölümü */}
                <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Yönetim Paneli</h1>
                        <p className="text-gray-500">Oyuncu başvurularını yönet ve takım duyurularını düzenle.</p>
                    </div>
                </div>

                {/* 1. Modül: Oyuncu Başvuru Tablosu */}
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
                                            {/* Profil Sütunu */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                                                    <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            {/* Oyun Bilgileri */}
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary flex items-center gap-1"><Gamepad2 size={14} /> {user.riotId}</span>
                                                    <span className="text-sm text-gray-500">{user.favoriteAgent}</span>
                                                </div>
                                            </td>
                                            {/* Statüs */}
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${user.teamRole === "OYUNCU"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                    }`}>
                                                    {user.teamRole === "OYUNCU" ? "Kadroda" : "Bekliyor"}
                                                </span>
                                            </td>
                                            {/* Btonlar */}
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
                {/* 2. Modül: Duyuru Yönetim Paneli */}
                <AdminAnnouncements initialAnnouncements={announcements} />
            </div>
        </main>
    );
}