"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hydration hatasını önlemek için bileşenin yüklendiğinden emin oluyoruz
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-10 h-10"></div>;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
            aria-label="Tema Değiştir"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}