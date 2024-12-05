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
			console.log('Profile does not exist');
			return NextResponse.json({ error: 'Profile does not exist' }, { status: 404 });
		}

		const alreadyBlocked = await pool.query(
			'SELECT * FROM profile_blocked WHERE user_id = $1 AND blocked_user_id = $2',
			[userId, friendId]
		);

		if (alreadyBlocked.rows.length > 0) {
			console.log('Profile already blocked');
			return NextResponse.json({ error: 'Profile already blocked' }, { status: 409 });
		}

		const blockProfile = await pool.query(
			'INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES ($1, $2) RETURNING *',
			[userId, friendId]
		);

		if (blockProfile.rows.length === 0) {
			console.log('Error reporting profile');
			return NextResponse.json({ error: 'Error reporting profile' }, { status: 500 });
		}

		const updateReportCount = await pool.query(
			'UPDATE users SET report_count = report_count + 1 WHERE id = $1 RETURNING *',
			[userId]
		);

		if (updateReportCount.rows.length === 0) {
			console.log('Error updating report count');
			return NextResponse.json({ error: 'Error updating report count' }, { status: 500 });
		}

		const unlinkProfileFetch = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/unlinkProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, encryptedFriendId: friendId })
		})

		return NextResponse.json(blockProfile.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}