"use client";

import { signIn, signOut } from "next-auth/react";

export default function AuthButton({ session }: { session: any }) {
    if (session) {
        return (
            <div className="flex flex-col items-center gap-4 mt-6">
                <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <img
                        src={session.user.image}
                        alt="Profil"
                        className="w-12 h-12 rounded-full border-2 border-red-500"
                    />
                    <div className="text-left">
                        <p className="text-sm text-gray-400">Hoş geldin,</p>
                        <p className="font-bold text-white">{session.user.name}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-all"
                >
                    Çıkış Yap
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <button
                onClick={() => signIn("discord")}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-md font-bold flex items-center gap-2 transition-all shadow-lg"
            >
                Discord ile Giriş Yap
            </button>
        </div>
    );
}