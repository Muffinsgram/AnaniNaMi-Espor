import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Ayarları az önce oluşturduğumuz dosyadan çekiyoruz

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };