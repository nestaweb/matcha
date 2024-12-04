import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

type Pair = [number, number];

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId } = await req.json();

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

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

		const unfinishedGrid = await pool.query(
			'SELECT * FROM matcha_grid WHERE user_id = $1 AND finished = false',
			[userId]
		);

		if (unfinishedGrid.rows.length > 0) {
			console.log('Unfinished grid found');
			return NextResponse.json(unfinishedGrid.rows[0].id, { status: 200 });
		}

		const newGrid = await pool.query(
			'INSERT INTO matcha_grid (user_id) VALUES ($1) RETURNING id',
			[userId]
		);

		if (newGrid.rows.length === 0) {
			console.log('Error creating new grid');
			return NextResponse.json({ error: 'Error creating new grid' }, { status: 500 });
		}

		const nbResult = await pool.query('SELECT COUNT(*) FROM users WHERE id != $1', [userId]);
		const nbUsers = parseInt(nbResult.rows[0].count) > 0 && parseInt(nbResult.rows[0].count) < 10 ? parseInt(nbResult.rows[0].count) : 10;

		const calculateDistanceSQL = `
			( 6371 * acos(
				cos(radians($3)) * cos(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT))) * 
				cos(radians(CAST(SPLIT_PART(location, ',', 1) AS FLOAT)) - radians($4)) + 
				sin(radians($3)) * sin(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT)))
			))
		`;

		const searchRadius = 50;
		
		const locationParts = user.rows[0].location.split(',');
		if (locationParts.length !== 2) {
			throw new Error('Invalid location format');
		}
		
		const userLongitude = parseFloat(locationParts[0]);
		const userLatitude = parseFloat(locationParts[1]);

		const ageRange = 10;
		const userAgeResult = await pool.query(
			`
			SELECT age
			FROM users
			WHERE id = $1
			`,
			[userId]
		);


		if (!userAgeResult.rows.length || !userAgeResult.rows[0].age) {
			throw new Error('User age not found');
		}

		const userAge = userAgeResult.rows[0].age;

		let randomUsersFetched = false;
		let nbUsersNeeded = nbUsers;
		let users: any[] = [];
		let attempts = 0;
		const maxAttempts = 10;
		while (!randomUsersFetched && attempts < maxAttempts) {
			attempts++;
			let tempUsers: any[] = [];
			if (nbUsersNeeded <= 0) {
				break;
			}

			const alreadySelectedIds = users.length > 0 
				? users.map(u => parseInt(cryptoService.decrypt({ 
					encryptedText: u.id.split('.')[0], 
					iv: u.id.split('.')[1] 
				}))) 
				: null;

			const randomUsers = await pool.query(
				`
				SELECT id, firstname, fame, location, age,
				( 6371 * acos(
					cos(radians($3)) * cos(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT))) * 
					cos(radians(CAST(SPLIT_PART(location, ',', 1) AS FLOAT)) - radians($4)) + 
					sin(radians($3)) * sin(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT)))
				)) AS distance
				FROM users
				WHERE id != $1
				AND location IS NOT NULL
				AND ( 6371 * acos(
					cos(radians($3)) * cos(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT))) * 
					cos(radians(CAST(SPLIT_PART(location, ',', 1) AS FLOAT)) - radians($4)) + 
					sin(radians($3)) * sin(radians(CAST(SPLIT_PART(location, ',', 2) AS FLOAT)))
				)) <= $5
				AND (age BETWEEN $6 AND $7)
				${alreadySelectedIds ? `AND id NOT IN (${alreadySelectedIds.join(',')})` : ''} 
				ORDER BY distance ASC, fame DESC, RANDOM()
				LIMIT $2
				`,
				[userId, nbUsersNeeded, userLatitude, userLongitude, searchRadius, userAge - ageRange, userAge + ageRange]
			);

			if (randomUsers.rows.length === 0) {
				break;
			}

			const likedProfiles = await pool.query(
				'SELECT * FROM profile_liked WHERE user_id = $1',
				[userId]
			);

			const likedProfilesMap = new Map<number, number>();
			likedProfiles.rows.forEach((row: any) => {
				likedProfilesMap.set(row.liked_user_id, row.user_id);
			});

			console.log('profiles liked', likedProfiles.rows);

			randomUsers.rows = randomUsers.rows.filter((user: any) => {
				return !likedProfilesMap.has(user.id);
			});

			const friendsProfiles = await pool.query(
				'SELECT * FROM user_friends WHERE user_id = $1 OR friend_id = $1',
				[userId]
			)

			const friendsProfilesMap = new Map<number, number>();
			friendsProfiles.rows.forEach((row: any) => {
				friendsProfilesMap.set(row.friend_id, row.user_id)
				friendsProfilesMap.set(row.user_id, row.friend_id)
			})

			randomUsers.rows = randomUsers.rows.filter((user: any) => {
				return !friendsProfilesMap.has(user.id);
			})


			const blockedProfiles = await pool.query(
				'SELECT * FROM profile_blocked WHERE user_id = $1',
				[userId]
			);

			const blockedProfilesMap = new Map<number, number>();
			blockedProfiles.rows.forEach((row: any) => {
				blockedProfilesMap.set(row.blocked_user_id, row.user_id);
				blockedProfilesMap.set(row.user_id, row.blocked_user_id);
			});

			randomUsers.rows = randomUsers.rows.filter((user: any) => {
				return !blockedProfilesMap.has(user.id);
			});

			randomUsers.rows = randomUsers.rows.filter((user: any) => {
				let keepUser = true;
				users.forEach((u: any) => {
					const decryptedUserKey = u.id.split('.');
					const decryptedUserId = cryptoService.decrypt({ encryptedText: decryptedUserKey[0], iv: decryptedUserKey[1] });
					if (parseInt(decryptedUserId) === user.id) {
						keepUser = false;
					}
				});
				return keepUser;
			});

			tempUsers = randomUsers.rows.map((user: any) => {
				const cryptedUserId = cryptoService.encrypt(user.id.toString());
				return {
					id: `${cryptedUserId.encryptedText}.${cryptedUserId.iv}`,
					firstName: user.firstname,
					fame: user.fame,
					distance: user.distance.toFixed(2)
				}
			})

			users = users.concat(tempUsers);

			if (users.length >= nbUsers) {
				randomUsersFetched = true;
			}
			else {
				nbUsersNeeded = nbUsers - users.length;
			}
		}

		const generateRandomPairs = (
			rows: number,
			cols: number,
			count: number
		  ): Pair[] => {
			const pairs: Pair[] = [];
			const totalCells = rows * cols;
		
			const isAdjacent = (a: number, b: number): boolean => {
				const rowA = Math.floor(a / cols);
				const colA = a % cols;
				const rowB = Math.floor(b / cols);
				const colB = b % cols;
			
				return Math.abs(rowA - rowB) <= 1 && Math.abs(colA - colB) <= 1;
			};
		
			const conflictsWithExistingPairs = (pair: Pair): boolean =>
				pairs.some(([p1, p2]) =>
					[p1, p2].some(
						(cell) => isAdjacent(cell, pair[0]) || isAdjacent(cell, pair[1])
					)
				);
		
			while (pairs.length < count) {
				const randomIndex = Math.floor(Math.random() * totalCells);
			
				const horizontal = Math.random() > 0.5;
				let pair: Pair | null = null;
			
				if (horizontal && (randomIndex % cols) < cols - 1) {
					pair = [randomIndex, randomIndex + 1];
				} else if (!horizontal && randomIndex + cols < totalCells) {
					pair = [randomIndex, randomIndex + cols];
				}
			
				if (
					pair &&
					!conflictsWithExistingPairs(pair) &&
					!pairs.some(([a, b]) => (a === pair[0] && b === pair[1]))
				) {
					pairs.push(pair);
				}
			}
		
			return pairs;
		};

		const newPairs = generateRandomPairs(8, 12, users.length);
		
		const pairs = newPairs.map((pair, index) => {
			const user = users[index % users.length];
			const cryptedUserId = user.id.split('.');
			const userIdParsed = parseInt(cryptoService.decrypt({ encryptedText: cryptedUserId[0], iv: cryptedUserId[1] }));
			return {
				grid_id: newGrid.rows[0].id,
				cell1: pair[0],
				cell2: pair[1],
				associated_user_id: userIdParsed
			}
		});

		if (pairs.length === 0) {
			console.log('No pairs generated');
			return NextResponse.json({ error: 'No pairs generated' }, { status: 500 });
		}

		for (const pair of pairs) {
			const insertPair = await pool.query(
				'INSERT INTO matcha_pairs (grid_id, cell1, cell2, associated_user_id) VALUES ($1, $2, $3, $4) RETURNING *',
				[pair.grid_id, pair.cell1, pair.cell2, pair.associated_user_id]
			);

			if (insertPair.rows.length === 0) {
				console.log('Error inserting pair');
				return NextResponse.json({ error: 'Error inserting pair' }, { status: 500 });
			}
		}

		console.log('Query successful:', users);
		return NextResponse.json(newGrid.rows[0].id, { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}