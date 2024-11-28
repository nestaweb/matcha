import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { chatRoomId } = await req.json();

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
		return NextResponse.json(chatInRoom.rows || [], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}