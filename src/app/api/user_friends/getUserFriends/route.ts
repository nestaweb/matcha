import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId } = await req.json();

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

		const userFriends = await pool.query(
			'SELECT * FROM user_friends WHERE user_id = $1 OR friend_id = $1 ORDER BY added_at',
			[userId]
		);

		const friends = userFriends.rows.map((friend: any) => {
			const encryptedUserId = cryptoService.encrypt(friend.user_id.toString());
			const encryptedFriendId = cryptoService.encrypt(friend.friend_id.toString());
			const stringEncryptedUserId = encryptedUserId.encryptedText + '.' + encryptedUserId.iv;
			const stringEncryptedFriendId = encryptedFriendId.encryptedText + '.' + encryptedFriendId.iv;
			console.log(typeof friend.user_id, typeof userId.toString());
			return friend.user_id === userId ? stringEncryptedFriendId : stringEncryptedUserId;
		});

		console.log('Query successful:', friends.length);
		return NextResponse.json(friends, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}