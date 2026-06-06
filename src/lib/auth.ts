import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Prisma client yolunu kendi projene göre ayarla

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Rol kontrollerini API üzerinden yapacağımız için JWT stratejisi performans açısından şarttır
    session: {
        strategy: "jwt",
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            // Standart scope'lar yeterli (email ve identify)
            authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Kullanıcı sisteme ilk kez giriş yaptığında (account nesnesi dolu gelir)
            if (account && account.provider === "discord") {
                const discordUserId = account.providerAccountId;
                let isAdmin = false;

                try {
                    const botToken = process.env.DISCORD_BOT_TOKEN;
                    const guildId = process.env.DISCORD_GUILD_ID;
                    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;

                    if (botToken && guildId && adminRoleId) {
                        // Discord API'sine Bot token'ımız ile istek atıyoruz
                        const response = await fetch(
                            `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
                            {
                                headers: {
                                    Authorization: `Bot ${botToken}`,
                                },
                                // Next.js'in bu isteği önbelleğe almaması için cache kapatıyoruz
                                cache: "no-store",
                            }
                        );

                        if (response.ok) {
                            const memberData = await response.json();
                            // Çekilen verideki 'roles' dizisi kullanıcının sahip olduğu rol ID'lerini içerir
                            if (memberData.roles && memberData.roles.includes(adminRoleId)) {
                                isAdmin = true;
                            }
                        } else {
                            console.error("Discord API hatası. Durum:", response.status);
                        }
                    }
                } catch (error) {
                    console.error("Rol kontrolü sırasında bir hata oluştu:", error);
                }

                // Bulduğumuz sonucu token'a kaydediyoruz
                token.isAdmin = isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            // Token'a kaydettiğimiz isAdmin bilgisini, client tarafında kullanılabilmesi için session'a aktarıyoruz
            if (session.user) {
                (session.user as any).isAdmin = token.isAdmin;
            }
            return session;
        },
    },
};