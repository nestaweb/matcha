import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { otp } = await req.json();
		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'SELECT * FROM otps WHERE otp = $1',
			[otp]
		);
		if (result.rows.length === 0) {
			return NextResponse.json({ error: 'OTP does not exist' }, { status: 404 });
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
			[result.rows[0].user_id]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const verifyUser = await pool.query(
			'UPDATE users SET verified = true WHERE id = $1 RETURNING *',
			[user.rows[0].id]
		);

		const deleteOtp = await pool.query(
			'DELETE FROM otps WHERE otp = $1',
			[otp]
		);

		console.log('Query successful:', result.rows);
		return NextResponse.json(verifyUser.rows[0], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}