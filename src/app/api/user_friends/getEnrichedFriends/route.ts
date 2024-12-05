import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { friends } = await req.json();

		if (friends === undefined) {
			return NextResponse.json({ error: 'Missing friends' }, { status: 400 });
		}

		if (friends.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);


		const friendsIds = friends.map((friend: any) => {
			const cryptedUserId = friend.split('.');
			const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

			return parseInt(cryptoService.decrypt(cryptedKeyUserId));
		});

		const userFriends = await pool.query(
			'SELECT * FROM users WHERE id = ANY($1)',
			[friendsIds]
		);

		if (userFriends.rows.length === 0) {
			return NextResponse.json({ error: 'No friends found' }, { status: 404 });
		}

		console.log('Query successful:', userFriends.rows.length);
		
		const userFriendsResponse = userFriends.rows.map((friend: any) => {
			const encryptedUserId = cryptoService.encrypt(friend.id.toString());
			const stringEncryptedUserId = encryptedUserId.encryptedText + '.' + encryptedUserId.iv;
			const encryptedFriendId = cryptoService.encrypt(friend.id.toString());
			const stringEncryptedFriendId = encryptedFriendId.encryptedText + '.' + encryptedFriendId.iv;
			return {
				user_id: stringEncryptedUserId,
				friend_id: stringEncryptedFriendId,
				added_at: friend.created_at,
				firstName: friend.firstname,
				lastName: friend.lastname,
				gender: friend.gender
			}
		});

		return NextResponse.json(userFriendsResponse, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}