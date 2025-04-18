import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

interface DatabaseUser {
    id: number;
    firstname: string;
    lastname: string;
    location: string;
    city: string;
    locationaccess: boolean;
}

interface GridPair {
	associated_user_id: number;
}

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({ error: 'Missing body' }, { status: 400 });
    }

    try {
        const { encryptedUserId } = await req.json();

        const cryptedUserId = encryptedUserId.split('.');
        const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };

        const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
        const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

        if (!userId || userId === undefined) {
            return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
        }

        // Get the grid id
        const gridResult = await pool.query(
            `SELECT id FROM matcha_grid WHERE user_id = $1`,
            [userId]
        );

        if (gridResult.rows.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const gridId = gridResult.rows[0].id;

        // Get all pairs in the grid
        const pairsResult = await pool.query(
            `SELECT associated_user_id FROM matcha_pairs WHERE grid_id = $1`,
            [gridId]
        );

        if (pairsResult.rows.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Extract all user IDs from pairs
        const userIds = pairsResult.rows.map((pair: GridPair) => pair.associated_user_id);
        
        // Get all users in the grid
        const result = await pool.query(
            `SELECT id, firstname, lastname, location, city, locationaccess 
             FROM users 
             WHERE id = ANY($1::int[])
             AND location IS NOT NULL 
             AND locationaccess = true`,
            [userIds]
        );

        const users = result.rows as DatabaseUser[];
        const locations = users.map(user => ({
            id: user.id,
            firstName: user.firstname,
            lastName: user.lastname,
            location: user.location,
            city: user.city
        }));
		console.log("location of user in grid: ", locations);

        return NextResponse.json(locations, { status: 200 });
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({ 
            error: error.message, 
            stack: error.stack 
        }, { status: 500 });
    }
}
