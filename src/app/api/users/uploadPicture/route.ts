import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const formData = await req.formData();
		const encryptedUserIdData = formData.getAll('encryptedUserId');

		if (encryptedUserIdData.length === 0) {
			return NextResponse.json({ error: 'Missing encryptedUserId' }, { status: 400 });
		}

		const encryptedUserId = encryptedUserIdData[0] as string;
		const file = formData.getAll('file');

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

		if (file.length === 0) {
			return NextResponse.json({ error: 'Missing file' }, { status: 400 });
		}

		const fileData = file[0] as File;
        const fileBuffer = await fileData.arrayBuffer();

        const uploadPath = path.join(process.cwd(), 'public', 'profileImages', String(userId));
        await fs.mkdir(uploadPath, { recursive: true });

        const files = await fs.readdir(uploadPath);

		if (files.length >= 5) {
			return NextResponse.json({ error: 'You can only upload 5 pictures' }, { status: 400 });
		}

		let fileName: string;
		const now = Date.now();
		let attemps = 0;
		let filePath = '';
		while (attemps < 10) {
			const fileNumber = Math.floor(Math.random() * 1000);
			const fileExtension = fileData.type.split('/')[1] || 'file';
			fileName = `${now.toString()}_${fileNumber}.${fileExtension}`;
			filePath = path.join(uploadPath, fileName);
			if (!files.includes(fileName) || attemps === 9) {
				break;
			}
			attemps++;
		}

        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        return NextResponse.json({
            message: 'File uploaded successfully!',
            path: filePath,
        });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}