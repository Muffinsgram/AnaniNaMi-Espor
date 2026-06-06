"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfileFields } from "@/app/actions/updateProfileFields";

export default function ProfileEditForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            bio: user.bio || "",
            twitterUrl: user.twitterUrl || "",
            twitchUrl: user.twitchUrl || "",
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        await updateProfileFields(data);
        setLoading(false);
        alert("Profil başarıyla güncellendi!");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Biyografi</label>
                <textarea
                    {...register("bio")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Takım geçmişinden veya oyun tarzından bahset..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input {...register("twitterUrl")} placeholder="Twitter URL" className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white" />
                <input {...register("twitchUrl")} placeholder="Twitch URL" className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white" />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20"
            >
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
        </form>
    );
}