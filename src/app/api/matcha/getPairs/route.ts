import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, gridId } = await req.json();

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

		if (!userId || userId === undefined) {
			console.log('Missing User ID');
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const grid = await pool.query(
			'SELECT * FROM matcha_grid WHERE id = $1',
			[gridId]
		);

		if (grid.rows.length === 0) {
			console.log('Grid does not exist');
			return NextResponse.json({ error: 'Grid does not exist' }, { status: 404 });
		}

		const pairs = await pool.query(
			'SELECT * FROM matcha_pairs WHERE grid_id = $1',
			[gridId]
		);

		const returnPairs = pairs.rows.map((pair: any) => {
			const cryptedKeyUserId = cryptoService.encrypt(pair.associated_user_id.toString());
			return {
				...pair,
				associated_user_id: cryptedKeyUserId.encryptedText + '.' + cryptedKeyUserId.iv
			}
		})

		console.log('Query successful:', pairs.rows);
		return NextResponse.json(returnPairs, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}