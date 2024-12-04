import { NextResponse, NextRequest } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, nbUsers } = await req.json();

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

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

		const fetchNbUsers = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getNbUser`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})

		const nbUsersResult = await fetchNbUsers.json();
		if (nbUsersResult.count < nbUsers && nbUsersResult.count > 0) {
			return NextResponse.json({ error: 'Not enough users' }, { status: 400 });
		}

		if (nbUsersResult.count === 0) {
			return NextResponse.json({ error: 'No users found' }, { status: 404 });
		}

		const result = await pool.query(
			'SELECT * FROM users WHERE id != $1 ORDER BY RANDOM() LIMIT $2',
			[userId, nbUsers]
		);

		if (result.rows.length === 0) {
			return NextResponse.json({ error: 'No users found' }, { status: 404 });
		}

		const users = result.rows.map((user: any) => {
			const cryptedUserId = cryptoService.encrypt(user.id.toString());
			return {
				id: `${cryptedUserId.encryptedText}.${cryptedUserId.iv}`,
				fame: user.fame
			}
		})

		if (users.length === 0) {
			return NextResponse.json({ error: 'No users found' }, { status: 404 });
		}

		console.log('Query successful:', users);
		return NextResponse.json(users, { status: 200 });
	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}