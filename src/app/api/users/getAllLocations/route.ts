import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';

interface DatabaseUser {
    id: number;
    firstname: string;
    lastname: string;
    location: string;
    city: string;
    locationaccess: boolean;
}

export async function GET(req: NextRequest) {
    try {
        const result = await pool.query(
            `SELECT id, firstname, lastname, location, city, locationaccess 
             FROM users 
             WHERE location IS NOT NULL 
             AND locationaccess = true`
        );

        const users = result.rows as DatabaseUser[];
        const locations = users.map(user => ({
            id: user.id,
            firstName: user.firstname,
            lastName: user.lastname,
            location: user.location,
            city: user.city
        }));

        return NextResponse.json(locations, { status: 200 });
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ 
            error: error.message, 
            stack: error.stack 
        }, { status: 500 });
    }
} 