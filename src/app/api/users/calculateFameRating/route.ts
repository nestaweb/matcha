import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

type User = {
	id: string,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	gender: string,
	sexualOrientation: string,
	age: number,
	goal: string,
	height: number,
	tags: string,
	bio: string,
	location: string,
	city: string,
	friends: string,
	locationAccess: string,
	fame: number,
	report_count: number,
	last_seen: Date,
	verified: boolean
};

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

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		function calculateFameRating(user: User, blockedCount: number, likesReceived: number, friendsCount: number, picturesCount: number): number {
			const baseScore = 50;
			
			const scoreBlocks = Math.max(-10, -(blockedCount * 0.5));
			const scoreLikes = Math.min(15, likesReceived * 0.1);
			const scoreFriends = Math.min(10, friendsCount * 0.2);
			const scoreLogin = (new Date().getTime() - user.last_seen.getTime()) / (1000 * 60 * 60 * 24) <= 7 ? 5 : -5;
			const scoreReports = Math.max(-15, -(user.report_count * 3));
			const scorePictures = Math.min(10, picturesCount * 2);
			const scoreBio = user.bio ? 5 : 0;
			const scoreHeight = user.height ? 5 : 0;
			const scoreTags = Math.min(10, user.tags ? user.tags.split(',').length : 0);
		  
			const totalScore = baseScore + scoreBlocks + scoreLikes + scoreFriends + 
							   scoreLogin + scoreReports + scorePictures + 
							   scoreBio + scoreHeight + scoreTags;
		  
			return Math.max(0, Math.min(100, totalScore));
		}
		
		const blockedCount = await pool.query(
			'SELECT COUNT(*) FROM profile_blocked WHERE blocked_user_id = $1',
			[userId]
		);

		const likesReceived = await pool.query(
			'SELECT COUNT(*) FROM profile_liked WHERE liked_user_id = $1',
			[userId]
		);

		const friendsCount = await pool.query(
			'SELECT COUNT(*) FROM user_friends WHERE user_id = $1 OR friend_id = $1',
			[userId]
		);

		const pictures = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getPictures`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

		const picturesData = await pictures.json();
		const picturesCount = picturesData.length;

		const fameRating = calculateFameRating(user.rows[0], blockedCount.rows[0].count, likesReceived.rows[0].count, friendsCount.rows[0].count, picturesCount);

		const updateFame = await pool.query(
			'UPDATE users SET fame = $1 WHERE id = $2',
			[fameRating, userId]
		);

		if (updateFame.rowCount === 0) {
			console.error('Failed to update fame rating');
			return NextResponse.json({ error: 'Failed to update fame rating' }, { status: 500 });
		}

		console.log('Query successful calculating fame rating:', fameRating);
		return NextResponse.json(fameRating, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}