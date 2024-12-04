import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, encryptedFriendId } = await req.json();

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

		const alreadyLiked = await pool.query(
			'SELECT * FROM profile_liked WHERE user_id = $1 AND liked_user_id = $2',
			[userId, friendId]
		);

		if (alreadyLiked.rows.length > 0) {
			console.log('Friend already liked');
			return NextResponse.json({ error: 'Friend already liked' }, { status: 409 });
		}

		const likeFriend = await pool.query(
			'INSERT INTO profile_liked (user_id, liked_user_id) VALUES ($1, $2) RETURNING *',
			[userId, friendId]
		);

		if (likeFriend.rows.length === 0) {
			console.log('Error liking friend');
			return NextResponse.json({ error: 'Error liking friend' }, { status: 500 });
		}

		const alreadyLikedBack = await pool.query(
			'SELECT * FROM profile_liked WHERE user_id = $1 AND liked_user_id = $2',
			[friendId, userId]
		);

		console.log('Already liked back:', alreadyLikedBack.rows);

		if (alreadyLikedBack.rows.length > 0) {
			const linkFriends = await pool.query(
				'INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2) RETURNING *',
				[userId, friendId]
			);

			console.log('Link friends:', linkFriends.rows);

			if (linkFriends.rows.length === 0) {
				console.log('Error linking friends');
				return NextResponse.json({ error: 'Error linking friends' }, { status: 500 });
			}
		}

		return NextResponse.json(likeFriend.rows, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}