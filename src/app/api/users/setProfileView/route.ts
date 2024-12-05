import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, visitedProfileId } = await req.json();

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

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

		const cryptedVisitedProfileId = visitedProfileId.split('.');
		const cryptedKeyVisitedProfileId = { encryptedText: cryptedVisitedProfileId[0], iv: cryptedVisitedProfileId[1] };
		const decryptedVisitedProfileId = parseInt(cryptoService.decrypt(cryptedKeyVisitedProfileId));

		const visitedUser = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[decryptedVisitedProfileId]
		);

		if (visitedUser.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const visitedProfile = await pool.query(
			'INSERT INTO profile_views (user_id, viewed_user_id) VALUES ($1, $2) RETURNING *',
			[userId, decryptedVisitedProfileId]
		);

		if (visitedProfile.rows.length === 0) {
			return NextResponse.json({ error: 'Profile view not recorded' }, { status: 404 });
		}

		return NextResponse.json(visitedProfile.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}