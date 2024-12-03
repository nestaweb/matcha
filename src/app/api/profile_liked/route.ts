import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';

export async function GET(req: NextRequest) {
	try {
		const profile_liked = await pool.query(
			'SELECT * FROM profile_liked'
		);

		return NextResponse.json(profile_liked.rows, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}