import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";


declare module "next-auth" {
	interface Session {
		encryptedUserId?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		encryptedUserId?: string;
	}
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };