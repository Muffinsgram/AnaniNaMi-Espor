"use client";

import { useState } from "react";
import { createMatch } from "@/app/actions/matchActions";
import { toast } from "sonner";
import { Plus, Trash2, Sword, Calendar, MapPin } from "lucide-react";

export default function AdminMatchesPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createMatch({
                opponent: formData.get("opponent") as string,
                date: new Date(formData.get("date") as string),
                map: formData.get("map") as string,
            });
            toast.success("Maç başarıyla eklendi!");
            e.currentTarget.reset();
        } catch {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto pt-24">
            <h1 className="text-3xl font-black text-white mb-8">Maç Yönetimi</h1>

            <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <input name="opponent" placeholder="Rakip Takım" className="bg-white/5 p-3 rounded-lg text-white" required />
                <input name="date" type="datetime-local" className="bg-white/5 p-3 rounded-lg text-white" required />
                <input name="map" placeholder="Harita (örn: Ascent)" className="bg-white/5 p-3 rounded-lg text-white" required />
                <button disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                    <Plus size={20} /> Ekle
                </button>
            </form>
        </div>
    );
}