import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { userId } = await req.json();

		// Check if user exists

		const otp = Math.floor(100000 + Math.random() * 900000);
		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'INSERT INTO otps (user_id, otp) VALUES ($1, $2) RETURNING *',
			[userId, otp]
		);
		console.log('Query successful:', result.rows);
		// return the otp
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