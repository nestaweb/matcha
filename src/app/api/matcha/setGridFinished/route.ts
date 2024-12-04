import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, gridId } = await req.json();

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

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

		const updatedGrid = await pool.query(
			'UPDATE matcha_grid SET finished = true WHERE id = $1 RETURNING *',
			[gridId]
		);
		
		if (updatedGrid.rows.length === 0) {
			console.log('Error updating grid');
			return NextResponse.json({ error: 'Error updating grid' }, { status: 500 });
		}

		console.log('Query successful:', updatedGrid.rows[0].id);
		return NextResponse.json(updatedGrid.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}