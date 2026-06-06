export default async function TestLoading() {
    // Sistemi bilerek 3 saniye boyunca donduruyoruz (Veritabanı bekleme simülasyonu)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return (
        <main className="w-full flex flex-col items-center justify-center pt-32 px-4 text-center">
            <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-12 rounded-[2.5rem] shadow-2xl">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Bağlantı Başarılı!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Loading ekranımızı tam 3 saniye boyunca başarıyla test ettin. Sitenin kendi ana renginde parladığını görmüş olmalısın.
                </p>
            </div>
        </main>
    );
}