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
			'SELECT * FROM otp WHERE otp = $1',
			[otp]
		);
		if (result.rows.length === 0) {
			return NextResponse.json({ error: 'OTP does not exist' }, { status: 404 });
		}
		console.log('Query successful:', result.rows);
		return NextResponse.json(result.rows);
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}