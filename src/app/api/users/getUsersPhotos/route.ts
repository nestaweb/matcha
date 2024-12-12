import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
	const { userId } = await req.json();
	const session = await getServerSession(authOptions);
  
	if (!session || !session.accessToken) {
	  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
  
	const accessToken = session.accessToken;
  
	try {
		const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	
		const data = await response.json();

		if (!response.ok) throw new Error(data.error.message || "Failed to fetch photos");
	
		return NextResponse.json(data.mediaItems, { status: 200 });
	} catch (error) {
		console.error("Error fetching photos:", error);
		NextResponse.json({ message: "Error fetching photos", error: error }, { status: 500 });
	}
}