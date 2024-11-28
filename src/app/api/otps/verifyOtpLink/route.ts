import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedOtp, encryptedUserId } = await req.json();

		const cryptedOtp = encryptedOtp.split('.');
		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyOtp = { encryptedText: cryptedOtp[0], iv: cryptedOtp[1] };
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const decryptedOtp = cryptoService.decrypt(cryptedKeyOtp);
		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));
		const { otpNumber } = JSON.parse(decryptedOtp);
		const otp = otpNumber;

		if (!otp || otp === '' || otp === undefined) {
			return NextResponse.json({ error: 'Missing OTP' }, { status: 400 });
		}
		if (!userId || userId === undefined) {
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'SELECT * FROM otps WHERE otp = $1',
			[otp]
		);
		console.log('result:', result.rows);
		if (result.rows.length === 0) {
			return NextResponse.json({ error: 'OTP does not exist' }, { status: 404 });
		}
		if (result.rows[0].user_id !== userId) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const currentTime = new Date();
		const otpTime = new Date(result.rows[0].created_at);
		const diff = Math.abs(currentTime.getTime() - otpTime.getTime());
		const diffMinutes = Math.ceil(diff / (1000 * 60));

		if (diffMinutes > 5) {
			console.log('Attempting to connect to database...');
			await pool.query(
				'DELETE FROM otps WHERE otp = $1',
				[otp]
			);
			return NextResponse.json({ error: 'OTP has expired' }, { status: 404 });
		}

		console.log('Attempting to connect to database...');
		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);
		console.log('user:', user.rows);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		console.log('Attempting to connect to database...');
		const verifyUser = await pool.query(
			'UPDATE users SET verified = true WHERE id = $1 RETURNING *',
			[userId]
		);
		console.log('verifyUser:', verifyUser.rows);

		console.log('Attempting to connect to database...');
		const deleteOtp = await pool.query(
			'DELETE FROM otps WHERE otp = $1',
			[otp]
		);
		console.log('deleteOtp:', deleteOtp.rows);

		console.log('Query successful:', result.rows);
		return NextResponse.json(verifyUser.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}