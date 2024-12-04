import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, idsList } = await req.json();

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

		const decryptedIdsList = idsList.map((id: string) => {
			const cryptedId = id.split('.');
			const cryptedKeyId = { encryptedText: cryptedId[0], iv: cryptedId[1] };
			return parseInt(cryptoService.decrypt(cryptedKeyId));
		});

		const users = await pool.query(
			'SELECT * FROM users WHERE id = ANY($1)',
			[decryptedIdsList]
		);

		if (users.rows.length === 0) {
			return NextResponse.json({ error: 'No users found' }, { status: 404 });
		}

		const usersInfos = users.rows.map((user: any) => {
			const isActive = user.lastconnection > new Date(Date.now() - 60000);
			const reEncryptedUserId = cryptoService.encrypt(user.id.toString());
			return {
				id: `${reEncryptedUserId.encryptedText}.${reEncryptedUserId.iv}`,
				firstName: user.firstname,
				lastName: user.lastname,
				age: user.age,
				fame: user.fame,
				active: isActive
			}
		});

		return NextResponse.json(usersInfos, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}