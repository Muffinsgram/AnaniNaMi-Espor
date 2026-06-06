import Link from "next/link";
import { Hash, MonitorPlay, PlaySquare, Gamepad2 } from "lucide-react";

export default function Footer() {
    // Yılı otomatik olarak almak için
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/10 bg-[#0B0C10] pt-12 pb-8 mt-auto z-50 relative">
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Logo / İsim */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                        AnaniNa'Mi<span className="text-primary"> ESPOR</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 font-bold tracking-wide">
                        Muffinsgram tarafından!
                    </p>
                </div>

                {/* Sosyal Medya İkonları (Lucide'ın Güvenli İkonları) */}
                <div className="flex gap-4">
                    {/* Twitter / X Temsili (Hashtag) */}
                    <Link href="https://www.instagram.com/Muffinsgram/" title="Instagram" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all border border-transparent hover:border-[#1DA1F2]/20">
                        <Hash size={20} />
                    </Link>

                    {/* Twitch Temsili (Yayın Ekranı) */}
                    <Link href="https://kick.com/muffinsgram" title="Kick" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#18FF23] hover:bg-[#18FF23]/10 transition-all border border-transparent hover:border-[#18FF23]/20">
                        <MonitorPlay size={20} />
                    </Link>

                    {/* YouTube Temsili (Video Oynatıcı) */}
                    <Link href="https://www.youtube.com/@muffinsgram/featured" title="YouTube" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#FF0000] hover:bg-[#FF0000]/10 transition-all border border-transparent hover:border-[#FF0000]/20">
                        <PlaySquare size={20} />
                    </Link>

                    {/* Discord Temsili (Oyun Kolu) */}
                    <Link href="https://discord.gg/6YuckmHp" title="Discord" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-all border border-transparent hover:border-[#5865F2]/20">
                        <Gamepad2 size={20} />
                    </Link>
                </div>
            </div>

            {/* Telif Hakkı (Copyright) & Alt Linkler */}
            <div className="max-w-5xl mx-auto px-4 mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <p>© {currentYear} AnaniNa'Mi ESPOR. TÜM HAKLARI SAKLIDIR.</p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-primary transition-colors">Gizlilik</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Kullanım Şartları</Link>
                    <Link href="#" className="hover:text-primary transition-colors">İletişim</Link>
                </div>
            </div>
        </footer>
    );
}