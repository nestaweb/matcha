import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, firstName, lastName, age, height, sexualOrientation, searchingFor, bio } = await req.json();

		if (encryptedUserId === undefined || !encryptedUserId) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		if (firstName === undefined || !firstName) {
			console.log('Missing First Name');
			return NextResponse.json({ error: 'Missing First Name' }, { status: 400 });
		}
		if (lastName === undefined || !lastName) {
			console.log('Missing Last Name');
			return NextResponse.json({ error: 'Missing Last Name' }, { status: 400 });
		}
		if (age === undefined) {
			console.log('Missing Age');
			return NextResponse.json({ error: 'Missing Age' }, { status: 400 });
		}
		if (height === undefined) {
			console.log('Missing Height');
			return NextResponse.json({ error: 'Missing Height' }, { status: 400 });
		}
		if (sexualOrientation === undefined || !sexualOrientation) {
			console.log('Missing Sexual Orientation');
			return NextResponse.json({ error: 'Missing Sexual Orientation' }, { status: 400 });
		}
		if (searchingFor === undefined || !searchingFor) {
			console.log('Missing Goal');
			return NextResponse.json({ error: 'Missing Goal' }, { status: 400 });
		}
		if (bio === undefined) {
			console.log('Missing Bio');
			return NextResponse.json({ error: 'Missing Bio' }, { status: 400 });
		}

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

		const modifiedUser = await pool.query(
			'UPDATE users SET firstname = $1, lastname = $2, age = $3, height = $4, sexualorientation = $5, goal = $6, bio = $7 WHERE id = $8 RETURNING *',
			[firstName, lastName, age, height, sexualOrientation, searchingFor, bio, userId]
		);

		if (modifiedUser.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

		console.log('Query successful:', user.rows);
		return NextResponse.json(modifiedUser.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}