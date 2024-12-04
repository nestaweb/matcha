import { NextResponse } from 'next/server';
import pool from '@/server/db';
import { cookies } from 'next/headers';
import { CryptoService } from '@/server/CryptoService';

export async function GET() {
	try {
		const cookieStore = await cookies();

		const userIdCookie = cookieStore.get('userId');
		if (!userIdCookie) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}
		const userIdValue = userIdCookie.value;
		const cryptedUserId = userIdValue.split('.');

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const userId = parseInt(cryptoService.decrypt({encryptedText: cryptedUserId[0], iv: cryptedUserId[1]}));

		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userIdValue })
		});

		if (user.rows[0].verified === false) {
			return NextResponse.json({ error: 'User is not verified' }, { status: 401 });
		}

		return NextResponse.json(userIdValue, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}