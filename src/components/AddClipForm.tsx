"use client";

import { useRef } from "react";
import { addClip } from "@/app/actions/clipActions";
import { toast } from "sonner";
import { Plus, Play, Tag, Type } from "lucide-react";

export default function AddClipForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        const title = formData.get("title");
        const url = formData.get("url");

        if (!title || !url) {
            toast.error("Lütfen tüm alanları doldurun!");
            return;
        }

        const result = await addClip(formData);

        if (result?.success) {
            toast.success("Klip başarıyla efsaneler arasına eklendi! 🔥");
            formRef.current?.reset(); // Formu temizle
        } else {
            toast.error(result?.error || "Klip eklenirken bir hata oluştu.");
        }
    }

    return (
        <div className="w-full max-w-xl bg-white/5 dark:bg-[#1a1c23]/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Plus size={18} className="text-primary" /> Yeni Video / Klip Ekle
            </h3>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                {/* Başlık Girişi */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Type size={12} /> Klip Başlığı
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Örn: Kaptan Deagle ile ACE Atıyor!"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                {/* YouTube URL Girişi */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Play size={12} /> YouTube Linki
                    </label>
                    <input
                        type="text"
                        name="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                {/* Kategori Seçimi */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag size={12} /> Kategori / Etiket
                    </label>
                    <select
                        name="tag"
                        className="w-full bg-[#111217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                        <option value="CLUTCH">CLUTCH</option>
                        <option value="ACE">ACE</option>
                        <option value="HIGHLIGHT">HIGHLIGHT</option>
                        <option value="KOMİK">KOMİK / TROLL</option>
                    </select>
                </div>

                {/* Gönder Butonu */}
                <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,70,85,0.3)] hover:shadow-[0_0_30px_rgba(255,70,85,0.5)] active:scale-[0.98] transition-all"
                >
                    Klibi Yayınla
                </button>
            </form>
        </div>
    );
}