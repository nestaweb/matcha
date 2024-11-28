import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { senderId, receiverId } = await req.json();

		const cryptedUserId = senderId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
		const cryptedReceiverId = receiverId.split('.');
		const cryptedKeyReceiverId = { encryptedText: cryptedReceiverId[0], iv: cryptedReceiverId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));
		const friendId = parseInt(cryptoService.decrypt(cryptedKeyReceiverId));

		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}
		if (!friendId || friendId === undefined) {
			return NextResponse.json({ error: 'Missing Friend ID' }, { status: 400 });
		}

		const chatRoom = await pool.query(
			'SELECT * FROM chat_room WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
			[userId, friendId]
		);

		if (chatRoom.rows.length === 0) {
			return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 });
		}

		const chatsOnRoom = await pool.query(
			'SELECT * FROM chat_message WHERE room_id = $1',
			[chatRoom.rows[0].id]
		);

		console.log('Query successful:', chatsOnRoom.rows);
		return NextResponse.json(chatsOnRoom.rows || [], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}