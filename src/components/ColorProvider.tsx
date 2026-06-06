"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ColorContextType = {
    color: string;
    setColor: (color: string) => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
    // Varsayılan olarak hep rose (kırmızı) ile başlatıyoruz ki çökmesin
    const [color, setColor] = useState("rose");

    useEffect(() => {
        // Sayfa yüklendiğinde (Client tarafında) hafızadaki rengi bul ve uygula
        const savedColor = localStorage.getItem("theme-color") || "rose";
        setColor(savedColor);
        document.documentElement.setAttribute("data-color", savedColor);
    }, []);

    const changeColor = (newColor: string) => {
        setColor(newColor);
        localStorage.setItem("theme-color", newColor);
        document.documentElement.setAttribute("data-color", newColor);
    };

    // Artık return kısmında sağlayıcıyı asla gizlemiyoruz!
    return (
        <ColorContext.Provider value={{ color, setColor: changeColor }}>
            {children}
        </ColorContext.Provider>
    );
}

export const useColor = () => {
    const context = useContext(ColorContext);
    if (!context) throw new Error("useColor must be used within ColorProvider");
    return context;
};