import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { senderId, receiverId, room_id, message, sentAt } = await req.json();

		console.log('chatRoomId sendMessage:', room_id);

		const cryptedUserId = senderId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
		const cryptedReceiverId = receiverId.split('.');
		const cryptedKeyReceiverId = { encryptedText: cryptedReceiverId[0], iv: cryptedReceiverId[1] };
		// const cryptedRoomId = chatRoomId.split('.');
		// const cryptedKeyRoomId = { encryptedText: cryptedRoomId[0], iv: cryptedRoomId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));
		const friendId = parseInt(cryptoService.decrypt(cryptedKeyReceiverId));
		// const roomId = parseInt(cryptoService.decrypt(cryptedKeyRoomId));

		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}
		if (!friendId || friendId === undefined) {
			return NextResponse.json({ error: 'Missing Friend ID' }, { status: 400 });
		}
		if (!room_id || room_id === undefined) {
			return NextResponse.json({ error: 'Missing Room ID' }, { status: 400 });
		}

		const sendMessage = await pool.query(
			'INSERT INTO chat_message (sender_id, receiver_id, room_id, message, sent_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[userId, friendId, room_id, message, sentAt]
		);

		if (sendMessage.rows.length === 0) {
			return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
		}

		console.log('Query successful:', sendMessage.rows[0]);
		return NextResponse.json(sendMessage.rows[0], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}