import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId } = await req.json();

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

		if (!userId || userId === undefined) {
			console.log('Error updating user last seen userID missing');
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			console.log('Error updating user last seen user dont exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const modifiedUser = await pool.query(
			'UPDATE users SET last_seen = NOW() WHERE id = $1 RETURNING *',
			[userId]
		);

		if (modifiedUser.rows.length === 0) {
			console.log('Error updating user last seen user dont update');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		return NextResponse.json(modifiedUser.rows[0].last_seen, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}