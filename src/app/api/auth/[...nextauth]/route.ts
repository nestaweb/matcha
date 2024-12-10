import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import pool from "@/server/db";
import { cookies } from 'next/headers';
import { CryptoService } from "@/server/CryptoService";

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

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			const { email, name } = user;
			const fullName = user?.name || profile?.name || "";
			const [firstName, lastName] = fullName.split(" ") || ["Unknown", "Unknown"];
		
			try {
				const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
				let encryptedUserId;
				if (result.rows.length === 0) {
					const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/createUser`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ firstName: firstName || "Unknown", lastName: lastName || "Unknown", email, password: "" }),
					})
					const data = await response.json();
					encryptedUserId = data;
					const cookieStore = await cookies();
					cookieStore.set('redirectURI', process.env.NEXT_PUBLIC_BASE_URL + "/register?step=2&userId=" + encryptedUserId);
				}
				else {
					const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password: "" }),
					})
					const data = await response.json();
					encryptedUserId = data;
					const cookieStore = await cookies();
					cookieStore.set('userId', encryptedUserId);
				}
				
				return true;
			} catch (error) {
				console.error("Database error during sign-in:", error);
				return false;
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };