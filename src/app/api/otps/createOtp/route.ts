import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { userId } = await req.json();

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		let otp;
		while (true) {
			otp = Math.floor(100000 + Math.random() * 900000);

			const otpExists = await pool.query(
				'SELECT * FROM otps WHERE otp = $1',
				[otp]
			);

			if (otpExists.rows.length === 0) {
				break;
			}
		}

		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'INSERT INTO otps (user_id, otp) VALUES ($1, $2) RETURNING *',
			[userId, otp]
		);

		console.log('Query successful:', result.rows);
		return NextResponse.json(result.rows[0]);
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}