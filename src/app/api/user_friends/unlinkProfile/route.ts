import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, encryptedFriendId } = await req.json();

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

		const cryptedFriendId = encryptedFriendId.split('.');
		const cryptedKeyFriendId = { encryptedText: cryptedFriendId[0], iv: cryptedFriendId[1] };
		const friendId = parseInt(cryptoService.decrypt(cryptedKeyFriendId));

		if (!userId || userId === undefined) {
			console.log('Missing User ID');
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}
		if (!friendId || friendId === undefined) {
			console.log('Missing Friend ID');
			return NextResponse.json({ error: 'Missing Friend ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const friend = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[friendId]
		);

		if (friend.rows.length === 0) {
			console.log('Friend does not exist');
			return NextResponse.json({ error: 'Friend does not exist' }, { status: 404 });
		}

		const unlinkFriend = await pool.query(
			'DELETE FROM user_friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
			[userId, friendId]
		);

		if (unlinkFriend.rowCount === 0) {
			console.log('Friend not found');
			return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
		}

		const unlikeProfile = await pool.query(
			'DELETE FROM profile_liked WHERE (user_id = $1 AND liked_user_id = $2) OR (user_id = $2 AND liked_user_id = $1)',
			[userId, friendId]
		);

		if (unlikeProfile.rowCount === 0) {
			console.log('Friend not found');
			return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
		}

		return NextResponse.json(unlinkFriend.rows, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}