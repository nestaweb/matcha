import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import pool from "@/server/db";
import { cookies } from 'next/headers';
import { CryptoService } from "@/server/CryptoService";

declare module "next-auth" {
	interface Session {
		encryptedUserId?: string;
		accessToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		encryptedUserId?: string;
	}
}

async function refreshAccessToken(token: any) {
	try {
	  const url =
		"https://oauth2.googleapis.com/token?" +
		new URLSearchParams({
		  client_id: process.env.GOOGLE_CLIENT_ID || "",
		  client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
		  grant_type: "refresh_token",
		  refresh_token: token.refreshToken || "",
		});
  
	  const response = await fetch(url, {
		headers: {
		  "Content-Type": "application/x-www-form-urlencoded",
		},
		method: "POST",
	  });
  
	  const refreshedTokens = await response.json();
  
	  if (!response.ok) {
		throw refreshedTokens;
	  }
  
	  return {
		...token,
		accessToken: refreshedTokens.access_token,
		accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
		refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
	  };
	} catch (error) {
	  return {
		...token,
		error: "RefreshAccessTokenError",
	  };
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
					scope: "openid email profile https://www.googleapis.com/auth/photoslibrary.readonly",
				},
			},
		}),
		FortyTwoProvider({
			clientId: process.env.FORTY_TWO_CLIENT_ID!,
			clientSecret: process.env.FORTY_TWO_CLIENT_SECRET!,
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
						body: JSON.stringify({ firstName: firstName || "Unknown", lastName: lastName || "Unknown", email, password: "", provider: account?.provider }),
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
		async jwt({ token, account }) {
			// If the user is signing in, store the access token
			if (account) {
			  token.accessToken = account.access_token;
			  token.refreshToken = account.refresh_token; // Store refresh token if needed
			  token.expiresAt = Date.now() + account.expires_at! * 1000; // Store token expiration time
			}
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			// Attach access token to the session
			session.accessToken = token.accessToken as string;
			console.log("session here ", session);
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};