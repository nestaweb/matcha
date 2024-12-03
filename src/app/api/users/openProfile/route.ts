import { NextResponse, NextRequest } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { id } = await req.json();

		console.log('ID:', id);

		if (!id || id === undefined) {
			console.log('Missing ID');
			return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
		}

		if (typeof id !== 'string') {
			console.log('Invalid ID');
			return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
		}

		if (!id.includes('.')) {
			console.log('Invalid ID 2');
			return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
		}

		const cryptedUserId = id.split('.');
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

		const reEncryptedUserId = cryptoService.encrypt(userId.toString());

		console.log('Query successful:', user.rows[0]);
		return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${reEncryptedUserId.encryptedText}.${reEncryptedUserId.iv}`, req.url));
	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}