"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/app/actions/announcement";

export default function AdminAnnouncements({ initialAnnouncements }: { initialAnnouncements: any[] }) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: { title: "", content: "" }
    });

    const openModal = (announcement?: any) => {
        if (announcement) {
            setEditingId(announcement.id);
            setValue("title", announcement.title);
            setValue("content", announcement.content);
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            if (editingId) {
                await updateAnnouncement(editingId, data);
                setAnnouncements(announcements.map(a => a.id === editingId ? { ...a, ...data } : a));
                toast.success("Duyuru güncellendi!");
            } else {
                await createAnnouncement(data);
                // Gerçek senaryoda veriyi sunucudan tekrar çekmek daha sağlıklıdır, 
                // ancak anlık tepki için UI'a ekliyoruz.
                setAnnouncements([{ id: Date.now().toString(), ...data, createdAt: new Date() }, ...announcements]);
                toast.success("Duyuru yayınlandı!");
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Bir hata oluştu. Yetkinizi kontrol edin.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu duyuruyu silmek istediğine emin misin?")) return;

        try {
            await deleteAnnouncement(id);
            setAnnouncements(announcements.filter(a => a.id !== id));
            toast.success("Duyuru silindi!");
        } catch (error) {
            toast.error("Silinirken bir hata oluştu.");
        }
    };

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white">Duyuru Yönetimi</h2>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg">
                    <Plus size={18} /> Yeni Duyuru
                </button>
            </div>

            {/* Duyuru Listesi Tablosu */}
            <div className="space-y-4">
                {announcements.length === 0 && <p className="text-gray-500 text-center py-8">Henüz hiç duyuru yok.</p>}

                {announcements.map((ann) => (
                    <div key={ann.id} className="flex justify-between items-center p-5 bg-[#0B0C10]/50 border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
                        <div>
                            <h3 className="text-white font-bold text-lg">{ann.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-1">{ann.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => openModal(ann)} className="p-2 bg-white/5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(ann.id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ekleme/Düzenleme Modalı */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1A1C23] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-black text-white mb-6">
                                {editingId ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Başlık</label>
                                    <input {...register("title")} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-all" placeholder="Duyuru başlığı..." />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">İçerik</label>
                                    <textarea {...register("content")} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-all h-32" placeholder="Duyuru detayları..." />
                                </div>

                                <button type="submit" disabled={isSaving} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg mt-4">
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {editingId ? "Değişiklikleri Kaydet" : "Duyuruyu Yayınla"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}