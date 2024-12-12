import { NextResponse, NextRequest } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId } = await req.json();

		let notifications = [];

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

		const visited =	await pool.query(
			'SELECT * FROM profile_views WHERE viewed_user_id = $1',
			[userId]
		);

		const notifVisited = visited.rows.map((visit: any) => {
			return {
				type: 'visited',
				title: 'Someone visited your profile',
				date: visit.viewed_at
			}
		})

		notifications.push(...notifVisited);

		const liked = await pool.query(
			'SELECT * FROM profile_liked WHERE liked_user_id = $1 AND deleted_at IS NULL',
			[userId]
		);

		const notifLiked = liked.rows.map((like: any) => {
			return {
				type: 'liked',
				title: 'Someone liked your profile',
				date: like.liked_at
			}
		})

		notifications.push(...notifLiked);

		const match = await pool.query(
			'SELECT * FROM user_friends WHERE user_id = $1 OR friend_id = $1',
			[userId]
		);

		const notifMatch = match.rows.map((match: any) => {
			return {
				type: 'match',
				title: 'You got a new match !',
				date: match.added_at
			}
		});

		notifications.push(...notifMatch);

		const unlikes = await pool.query(
			'SELECT * FROM profile_liked WHERE liked_user_id = $1 AND deleted_at IS NOT NULL',
			[userId]
		);

		const notifUnliked = unlikes.rows.map((unlike: any) => {
			return {
				type: 'unliked',
				title: 'Someone unliked you',
				date: unlike.deleted_at
			}
		});

		notifications.push(...notifUnliked);

		const messages = await pool.query(
			'SELECT * FROM chat_message WHERE receiver_id = $1',
			[userId]
		);

		const notifMessages = messages.rows.map((message: any) => {
			return {
				type: 'message',
				title: 'You got a new message !',
				date: message.sent_at
			}
		});

		notifications.push(...notifMessages);

		const blocked = await pool.query(
			'SELECT * FROM profile_blocked WHERE blocked_user_id = $1',
			[userId]
		);

		const notifBlocked = blocked.rows.map((block: any) => {
			return {
				type: 'blocked',
				title: 'You have been blocked by someone',
				date: block.blocked_at
			}
		})

		console.log("Query successful notifications:", notifBlocked, blocked.rows);

		notifications.push(...notifBlocked);

		const reported = await pool.query(
			'SELECT * FROM profile_reported WHERE reported_user_id = $1',
			[userId]
		);

		const notifReported = reported.rows.map(async (report: any) => {
			return {
				type: 'reported',
				title: 'You have been reported by someone',
				date: report.reported_at
			}
		})

		notifications.push(...notifReported);

		const storedNotifications = await pool.query(
			'SELECT * FROM notifications WHERE user_id = $1',
			[userId]
		);

		if (storedNotifications.rows.length > 0) {
			notifications = notifications.filter((notification, index, self) =>
				index === self.findIndex((t) => (
					t.type === notification.type && t.title === notification.title && t.date === notification.date
				))
			);
		}

		for (let i = 0; i < notifications.length; i++) {
			const insertNotification = await pool.query(
				'INSERT INTO notifications (user_id, type, title, date) VALUES ($1, $2, $3, $4) RETURNING *',
				[userId, notifications[i].type, notifications[i].title, notifications[i].date]
			);
		}

		return NextResponse.json(notifications, { status: 200 });

	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}
