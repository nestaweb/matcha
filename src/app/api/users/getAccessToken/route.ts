import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const accessToken = session.accessToken;
		console.log("Access Token:", accessToken);

		return NextResponse.json({ accessToken });
	} catch (error) {
		console.error("Error fetching access token:", error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}