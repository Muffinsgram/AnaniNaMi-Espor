import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { ColorProvider } from "@/components/ColorProvider";
import NextTopLoader from "nextjs-toploader"; // Yükleme animasyonu paketi
import { Toaster } from "sonner";

export const metadata = {
  title: "Valorant E-Spor Takımı",
  description: "Premier Valorant Takımı Yönetim ve Taraftar Portalı",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-[#0B0C10] dark:text-gray-100 transition-colors duration-500 min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" theme="dark" />
            <ColorProvider>
              {/* Sayfa geçişlerindeki minimal üst bar (Rengini primary değişkenine bağladık) */}
              <NextTopLoader
                color="var(--primary)"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
              />
              <Navbar />
              <div className="flex-grow">
                {children}
              </div>
            </ColorProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}