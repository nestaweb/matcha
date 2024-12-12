import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

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

		const uploadPath = path.join(process.cwd(), 'public', 'profileImages', String(userId));
		if (!existsSync(uploadPath)) {
			return NextResponse.json([], { status: 200 });
		}
		
		const filesInDir = await fs.readdir(uploadPath);

		const files = filesInDir.map((file, index) => {
			const imagePath = path.join(uploadPath, file);
			const imageBuffer = readFileSync(imagePath);
			const imageBase64 = Buffer.from(imageBuffer).toString('base64');
			return {
				uploadPath: imagePath,
				imageBuffer: `data:image/jpeg;base64,${imageBase64}`,
			};
		})
		
        return NextResponse.json(files, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}