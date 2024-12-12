import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CryptoService } from '@/server/CryptoService';
import pool from '@/server/db';

export async function POST(req: NextRequest) {
	try {
		if (!req.body) {
			return NextResponse.json({ error: 'Missing body' }, { status: 400 });
		}

		const { photoUrl, encryptedUserId } = await req.json();

		if (!photoUrl || !encryptedUserId) {
			return NextResponse.json(
				{ error: 'Missing photoUrl or encryptedUserId' },
				{ status: 400 }
			);
		}

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
		}

		const downloadPath = path.join(process.cwd(), 'public', 'profileImages', String(userId));
		await fs.mkdir(downloadPath, { recursive: true });

		const response = await fetch(photoUrl);
		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch photo from URL: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const contentType = response.headers.get('Content-Type') || 'image/jpeg';
		const fileExtension = contentType.split('/')[1] || 'jpg';
		const now = Date.now();
		const fileName = `${now}_google_photo.${fileExtension}`;
		const filePath = path.join(downloadPath, fileName);

		const buffer = await response.arrayBuffer();
		await fs.writeFile(filePath, Buffer.from(buffer));

		await pool.query(
			'UPDATE users SET nb_photos = nb_photos + 1 WHERE id = $1',
			[userId]
		);

		return NextResponse.json({
			message: 'Photo downloaded and saved successfully!',
			path: `/profileImages/${userId}/${fileName}`,
		});
	} catch (error: any) {
		console.error('Error downloading photo:', error);
		return NextResponse.json(
			{ error: error.message, stack: error.stack },
			{ status: 500 }
		);
	}
}
