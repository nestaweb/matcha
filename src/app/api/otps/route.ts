import { NextResponse } from 'next/server';
import pool from '@/server/db';

export async function GET() {
  try {
    console.log('Attempting to connect to database...');
    const result = await pool.query('SELECT * FROM otps');
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