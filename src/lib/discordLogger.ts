// src/lib/discordLogger.ts

const WEBHOOK_LOGS = process.env.DISCORD_WEBHOOK_LOGS;
const WEBHOOK_PUBLIC = process.env.DISCORD_WEBHOOK_PUBLIC;

// Olay türüne göre kart renkleri
const COLORS = {
    SUCCESS: 0x10B981, // Zümrüt Yeşili
    WARNING: 0xF59E0B, // Uyarı Sarısı
    DANGER: 0xEF4444, // Kırmızı Alarm
    INFO: 0x3B82F6, // Sistem Mavisi
    MEDIA: 0xFF4655, // Valorant Kırmızısı (Şov Rengi)
};

type LogType = keyof typeof COLORS;

// Botun kılık değiştirmesi için modül profilleri
const BOT_PROFILES = {
    MEDIA: { username: "🎬 Medya Log", avatar_url: "https://i.imgur.com/B1pU5O5.png" }, // Örnek kamera ikonu
    MATCH: { username: "🏆 Maç Log", avatar_url: "https://i.imgur.com/V7RkV1a.png" }, // Örnek kupa ikonu
    ROSTER: { username: "🎯 Kadro Log", avatar_url: "https://i.imgur.com/7Y9mU2u.png" }, // Örnek radar ikonu
    SYSTEM: { username: "🛡️ Sistem Log", avatar_url: "https://i.imgur.com/4zYgO2G.png" } // Örnek kalkan ikonu
};

type ModuleType = keyof typeof BOT_PROFILES;

interface DiscordLogOptions {
    module: ModuleType;       // Hangi departmandan geliyor?
    title: string;            // Olayın başlığı
    description: string;      // Olayın detayı
    type?: LogType;           // Rengi belirler
    fields?: { name: string; value: string; inline?: boolean }[]; // Önce/Sonra verileri
    imageUrl?: string;        // (Public) Kartın altına eklenecek devasa afiş
    thumbnailUrl?: string;    // (Log) Kartın sağına eklenecek küçük ikon
    url?: string;             // Başlığa tıklanınca gidilecek link
    isPublic?: boolean;       // Herkese açık kanala mı gitsin?
    adminName?: string;       // İşlemi yapan patron
    adminImage?: string;      // İşlemi yapan patronun Discord profil fotosu
}

export async function sendDiscordLog({
    module,
    title,
    description,
    type = 'INFO',
    fields,
    imageUrl,
    thumbnailUrl,
    url,
    isPublic = false,
    adminName = "Bilinmeyen Yetkili",
    adminImage
}: DiscordLogOptions) {

    const targetWebhook = isPublic ? WEBHOOK_PUBLIC : WEBHOOK_LOGS;
    if (!targetWebhook) return;

    // Discord Embed (Zengin Kart) Tasarımı
    const embed: any = {
        title: title,
        description: description,
        color: COLORS[type],
        timestamp: new Date().toISOString(), // Milisaniyesine kadar zaman damgası

        // Kartın en tepesinde işlemi yapan admini rozet gibi gösteriyoruz
        author: {
            name: `Yetkili: ${adminName}`,
            icon_url: adminImage || "https://i.imgur.com/8Q5Z2jG.png" // Foto yoksa varsayılan admin ikonu
        },

        // Kartın en altındaki imza
        footer: {
            text: "Komuta Merkezi Otomasyonu",
            icon_url: "https://i.imgur.com/M5aX1bY.png" // Takım logosu falan konulabilir
        }
    };

    // Ekstra görsel ve verileri karta ekleme
    if (fields && fields.length > 0) embed.fields = fields;
    if (url) embed.url = url;

    // Herkese açık medyada dev afiş (image), gizli loglarda küçük ikon (thumbnail) şıklığı
    if (imageUrl) embed.image = { url: imageUrl };
    if (thumbnailUrl) embed.thumbnail = { url: thumbnailUrl };

    try {
        await fetch(targetWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // Botun adını ve profil fotoğrafını o anki modüle göre değiştiriyoruz
                username: BOT_PROFILES[module].username,
                avatar_url: BOT_PROFILES[module].avatar_url,

                // Eğer public kanalsa @everyone çakıyoruz
                content: isPublic ? "🚨 **YENİ BİR İÇERİK YAYINDA!** @everyone" : null,
                embeds: [embed]
            })
        });
    } catch (error) {
        console.error("Discord İstihbarat Ağına ulaşılamadı:", error);
    }
}