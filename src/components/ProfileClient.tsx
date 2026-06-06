"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadDropzone } from "@/utils/uploadthing";
import { updateProfileFields } from "@/app/actions/updateProfileFields";
import { User, Save, Loader2, Trash2, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SocialSelector, { iconMap } from "./SocialSelector";

export default function ProfileClient({ initialUser }: { initialUser: any }) {
    const [user, setUser] = useState(initialUser);
    const [isSaving, setIsSaving] = useState(false);
    const [links, setLinks] = useState(initialUser.socialLinks || []);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            bio: user.bio || "",
            riotId: user.riotId || "",
            favoriteAgent: user.favoriteAgent || "",
            teamRole: user.teamRole || "TARAFTAR"
        }
    });

    const removeLink = (index: number) => setLinks(links.filter((_: any, i: number) => i !== index));
    const updateLink = (index: number, field: string, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            // Sadece güncel form verilerini ve links array'ini gönderiyoruz
            await updateProfileFields({
                ...data,
                socialLinks: links
            });
            setUser({ ...user, ...data, socialLinks: links });
            toast.success("Profil başarıyla güncellendi!");
        } catch (error) {
            toast.error("Güncelleme sırasında bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#0B0C10]/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl"
        >
            <div className="flex flex-col md:flex-row gap-10 items-center mb-12">
                <img src={user.customAvatar || user.image} className="w-36 h-36 rounded-full border-4 border-primary/30 shadow-xl object-cover" alt="Profil" />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-white">{user.name}</h1>
                    <p className="text-primary font-bold mt-1 text-lg">{user.teamRole}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><User size={20} className="text-primary" /> Kişisel Bilgiler</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Riot ID</label>
                            <input {...register("riotId")} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Favori Ajan</label>
                            <input {...register("favoriteAgent")} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
                        </div>
                    </div>

                    <textarea {...register("bio")} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none h-24" placeholder="Hakkında..." />

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sosyal Medya</label>
                        {links.map((link: any, index: number) => (
                            <div key={index} className="flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/5">
                                {(() => { const Icon = iconMap[link.platform]; return <Icon size={18} className="text-primary ml-2" /> })()}
                                <input value={link.url} onChange={(e) => updateLink(index, "url", e.target.value)} placeholder="URL" className="flex-1 bg-transparent p-2 text-white text-xs outline-none" />
                                <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <SocialSelector onSelect={(platform) => setLinks([...links, { platform, url: "" }])} />
                    </div>

                    <button type="submit" disabled={isSaving} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} Kaydet
                    </button>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Award size={20} className="text-primary" /> Profil Görseli</h2>
                    <UploadDropzone
                        endpoint="avatarUploader"
                        appearance={{ container: "border-2 border-dashed border-white/10 rounded-3xl bg-white/5 p-8 cursor-pointer" }}
                        onClientUploadComplete={async (res) => {
                            await updateProfileFields({ customAvatar: res[0].url });
                            setUser({ ...user, customAvatar: res[0].url });
                            toast.success("Fotoğraf güncellendi!");
                        }}
                    />
                </div>
            </form>
        </motion.div>
    );
}