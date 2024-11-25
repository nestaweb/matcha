import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const cookieStore = await cookies();

		const userIdCookie = cookieStore.get('userId');
		if (!userIdCookie) {
			return NextResponse.json({ status: 200 });
		}

		cookieStore.delete('userId');
		
		return NextResponse.json({ status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}