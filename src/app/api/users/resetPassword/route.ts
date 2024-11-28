import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedEmail, password, confirmPassword } = await req.json();

		console.log(encryptedEmail, password, confirmPassword);

		if (!password || !confirmPassword) {
			return NextResponse.json({ error: 'Missing password or confirmPassword' }, { status: 400 });
		}

		const cryptedEmail = encryptedEmail.split('.');
		const cryptedKeyEmail = { encryptedText: cryptedEmail[0], iv: cryptedEmail[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const email = cryptoService.decrypt(cryptedKeyEmail);

		if (!email || email === undefined) {
			console.log('Missing Email');
			return NextResponse.json({ error: 'Missing Email' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		if (user.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const encryptedPassword = await bcrypt.hash(password, 10);

		const userExists = user.rows[0];
		const passwordMatch = await bcrypt.compare(confirmPassword, encryptedPassword);

		if (!passwordMatch) {
			console.log('The passwords does not match');
			return NextResponse.json({ error: 'The passwords does not match' }, { status: 400 });
		}

		const reEncryptedUserId = cryptoService.encrypt(userExists.id.toString());
		const encryptedParamUserId = reEncryptedUserId.encryptedText + '.' + reEncryptedUserId.iv;

		const modifiedUser = await pool.query(
			'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
			[encryptedPassword, email]
		);

		if (modifiedUser.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		console.log('Query successful:', user.rows);
		return NextResponse.json(encryptedParamUserId, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}