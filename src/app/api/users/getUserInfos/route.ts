import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';
import { UserResponse } from '@/types/user';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId } = await req.json();

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

		const userFriends = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/getUserFriends`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		})

		let friends = [];
		if (userFriends.status === 200) {
			const data = await userFriends.json();
			friends = data.map((friend: any) => {
				return friend;
			});
		}

		console.log('Query successful friends:', friends.length);

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

		const fameCalculation = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/calculateFameRating`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		})

		const fame = await fameCalculation.json();

		console.log('Query successful user:', user.rows.length);
		const userInfos = {
			firstName: user.rows[0].firstname,
			lastName: user.rows[0].lastname,
			email: user.rows[0].email,
			provider: user.rows[0].provider,
			age: user.rows[0].age,
			sexualOrientation: user.rows[0].sexualorientation,
			gender: user.rows[0].gender,
			tags: user.rows[0].tags,
			goal: user.rows[0].goal,
			height: user.rows[0].height,
			bio: user.rows[0].bio,
			nb_photos: user.rows[0].nb_photos,
			location: user.rows[0].location,
			friends: friends,
			locationAccess: user.rows[0].locationaccess,
			city: user.rows[0].city,
			fame: fame,
			lastSeen: user.rows[0].last_seen,
		} as UserResponse;
		return NextResponse.json(userInfos, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}