"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import ColorPicker from "./ColorPicker";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        // DEĞİŞEN KISIM BURASI:
        // 'sticky' yerine 'fixed' yaptık. 'pt-4' aynen kaldı ama artık sayfa akışını bozmaz.
        // pointer-events-none ekledik ki boşluklara tıklayınca arkadaki elemanlar engellenmesin.
        <header className="fixed top-0 left-0 right-0 w-full flex justify-center pt-4 px-4 z-50 pointer-events-none">

            {/* 'pointer-events-auto' ile sadece menünün kendisine tıklanabilmesini sağladık */}
            <nav className="pointer-events-auto w-full max-w-5xl bg-white/70 dark:bg-[#0B0C10]/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-full py-3 px-6 flex justify-between items-center shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300">

                <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1 hover:opacity-80 transition-opacity">
                    Anani<span className="text-primary transition-colors duration-300">Na'Mi</span>
                </Link>

                <div className="hidden md:flex gap-8 items-center font-medium text-sm text-gray-700 dark:text-gray-300">
                    <Link href="/kadro" className="hover:text-primary transition-colors duration-300 uppercase tracking-wider text-xs font-bold">Kadro</Link>
                    <Link href="/fikstur" className="hover:text-primary transition-colors duration-300 uppercase tracking-wider text-xs font-bold">Maçlar</Link>

                    {session && (
                        <Link href="/taktik-odasi" className="text-primary hover:text-primary/80 transition-colors duration-300 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
                            Taktik Odası <span className="text-base leading-none">🔒</span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <ColorPicker />

                    {session ? (
                        <ProfileDropdown />
                    ) : (
                        <button onClick={() => signIn("discord")} className="text-sm font-bold bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] uppercase tracking-wide">
                            Giriş
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}