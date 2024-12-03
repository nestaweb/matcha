import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, gridId, cellId } = await req.json();

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const cryptedUserId = encryptedUserId.split('.');
		const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
		const userId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

		if (!userId || userId === undefined) {
			console.log('Missing User ID');
			return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
		}

		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			console.log('User does not exist');
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const grid = await pool.query(
			'SELECT * FROM matcha_grid WHERE id = $1',
			[gridId]
		);

		if (grid.rows.length === 0) {
			console.log('Grid does not exist');
			return NextResponse.json({ error: 'Grid does not exist' }, { status: 404 });
		}

		const cellAlreadyClicked = await pool.query(
			'SELECT * FROM matcha_clicked_cells WHERE grid_id = $1 AND cell_index = $2',
			[gridId, cellId]
		);

		if (cellAlreadyClicked.rows.length > 0) {
			console.log('Cell already clicked');
			return NextResponse.json(cellAlreadyClicked.rows[0], { status: 409 });
		}

		const clickedCell = await pool.query(
			'INSERT INTO matcha_clicked_cells (grid_id, cell_index) VALUES ($1, $2) RETURNING id',
			[gridId, cellId]
		);

		if (clickedCell.rows.length === 0) {
			console.log('Error creating clicked cell');
			return NextResponse.json({ error: 'Error creating clicked cell' }, { status: 500 });
		}

		const cellInPair = await pool.query(
			'SELECT * FROM matcha_pairs WHERE (grid_id = $1 AND cell1 = $2) OR (grid_id = $1 AND cell2 = $2)',
			[gridId, cellId]
		);

		if (cellInPair.rows.length > 0) {
			const pair = cellInPair.rows[0];

			if (pair.discovered) {
				console.log('Pair already discovered');
				return NextResponse.json(clickedCell.rows[0], { status: 200 });
			}

			const otherCellAlreadyClicked = await pool.query(
				'SELECT * FROM matcha_clicked_cells WHERE grid_id = $1 AND cell_index = $2',
				[gridId, pair.cell1 === cellId ? pair.cell2 : pair.cell1]
			);

			if (otherCellAlreadyClicked.rows.length > 0) {
				console.log('Pair already discovered');
				return NextResponse.json(clickedCell.rows[0], { status: 200 });
			}

			const otherClickedCell = await pool.query(
				'INSERT INTO matcha_clicked_cells (grid_id, cell_index) VALUES ($1, $2) RETURNING id',
				[gridId, pair.cell1 === cellId ? pair.cell2 : pair.cell1]
			);

			if (otherClickedCell.rows.length === 0) {
				console.log('Error creating other clicked cell');
				return NextResponse.json({ error: 'Error creating other clicked cell' }, { status: 500 });
			}

			const updatedPair = await pool.query(
				'UPDATE matcha_pairs SET discovered = true WHERE id = $1 RETURNING *',
				[pair.id]
			);

			if (updatedPair.rows.length === 0) {
				console.log('Error updating pair');
				return NextResponse.json({ error: 'Error updating pair' }, { status: 500 });
			}

			const gridPairs = await pool.query(
				'SELECT * FROM matcha_pairs WHERE grid_id = $1',
				[gridId]
			);

			if (gridPairs.rows.every((pair: any) => pair.discovered)) {
				const updatedGrid = await pool.query(
					'UPDATE matcha_grid SET finished = true WHERE id = $1 RETURNING *',
					[gridId]
				);

				if (updatedGrid.rows.length === 0) {
					console.log('Error updating grid');
					return NextResponse.json({ error: 'Error updating grid' }, { status: 500 });
				}
			}
		}

		console.log('Query successful:', clickedCell.rows[0]);
		return NextResponse.json(clickedCell.rows[0], { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}