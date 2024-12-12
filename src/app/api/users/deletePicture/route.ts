import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';
import { readFileSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
		const { encryptedUserId, imagePath } = await req.json();

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

		const userId = cryptoService.decrypt(cryptedKeyUserId);

		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

        if (!userId || !path) {
            return NextResponse.json(
                { error: 'Missing userId or fileNumber in the query parameters' },
                { status: 400 }
            );
        }

        const userIdInt = parseInt(userId, 10);
		const uploadPath = path.join(process.cwd(), 'public', 'profileImages', String(userIdInt));
        const files = await fs.readdir(uploadPath);
		
		const fileNumberInt = imagePath.split('.')[0];

		const fileToDelete = files.find((file) => {
			const fileNumber = file.split('.')[0];
			const fileWithoutPath = file.split('/')[file.split('/').length - 1];
			const fileNumberInt = fileWithoutPath.split('.')[0];
			return fileNumber === fileNumberInt;
		});

        if (!fileToDelete) {
			console.log('File does not exist');
            return NextResponse.json(
                { error: `File ${fileNumberInt} does not exist for user ${userIdInt}` },
                { status: 404 }
            );
        }

        const filePath = path.join(uploadPath, fileToDelete);

        await fs.unlink(filePath);

		const filesAfterDelete = await fs.readdir(uploadPath);

		const filesReturn = filesAfterDelete.map((file, index) => {
			const imagePath = path.join(uploadPath, file);
			const imageBuffer = readFileSync(imagePath);
			const imageBase64 = Buffer.from(imageBuffer).toString('base64');
			return {
				uploadPath: imagePath,
				imageBuffer: `data:image/jpeg;base64,${imageBase64}`,
			};
		})

		await pool.query(
			'UPDATE users SET nb_photos = nb_photos - 1 WHERE id = $1',
			[userId]
		);

        return NextResponse.json(filesReturn, { status: 200 });
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { error: 'User directory does not exist or file not found' },
                { status: 404 }
            );
        }

        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
