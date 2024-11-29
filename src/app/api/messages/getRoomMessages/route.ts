import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { chatRoomId } = await req.json();
		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		console.log('chatRoomId:', chatRoomId);

		// const cryptedRoomId = chatRoomId.split('.');
		// const cryptedKeyRoomId = { encryptedText: cryptedRoomId[0], iv: cryptedRoomId[1] };

		// const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		// const roomId = parseInt(cryptoService.decrypt(cryptedKeyRoomId));
		const roomId = chatRoomId;

		if (!roomId || roomId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const chatInRoom = await pool.query(
			'SELECT * FROM chat_message WHERE room_id = $1',
			[roomId]
		);

		console.log('Query successful:', chatInRoom.rows);
		const chatMessages = chatInRoom.rows.map((chat: any) => {
			const cryptedSenderId = cryptoService.encrypt(chat.sender_id.toString());
			const cryptedReceiverId = cryptoService.encrypt(chat.receiver_id.toString());
			return {
				id: chat.id,
				senderId: `${cryptedSenderId.encryptedText}.${cryptedSenderId.iv}`,
				receiverId: `${cryptedReceiverId.encryptedText}.${cryptedReceiverId.iv}`,
				room_id: chat.room_id,
				message: chat.message,
				sentAt: chat.sent_at
			}
		});
		return NextResponse.json(chatMessages || [], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}