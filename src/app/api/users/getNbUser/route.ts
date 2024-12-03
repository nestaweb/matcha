import { NextResponse } from 'next/server';
import pool from '@/server/db';

export async function GET() {
  try {
    console.log('Attempting to connect to database...');
	  const nbResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log('Query successful:', nbResult.rows[0]);
    return NextResponse.json(nbResult.rows[0]);
  }
  catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: error.message, 
      stack: error.stack 
    }, { status: 500 });
  }
}