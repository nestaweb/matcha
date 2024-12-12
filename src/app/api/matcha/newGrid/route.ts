import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';

type Pair = [number, number];

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, ageRange, fameRange, locationRadius, tags, sort } = await req.json();

		const lastSeenUpdate = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLastSeen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId })
		});

		if (ageRange === undefined || fameRange === undefined || locationRadius === undefined) {
			console.log('Missing parameters');
			return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
		}

		if (fameRange.length !== 2) {
			console.log('Invalid fame range');
			return NextResponse.json({ error: 'Invalid fame range' }, { status: 400 });
		}

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
			const updateGrid = await pool.query(
				'UPDATE matcha_grid SET finished = true WHERE id = $1',
				[unfinishedGrid.rows[0].id]
			);
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
		
		const locationParts = user.rows[0].location.split(',');
		if (locationParts.length !== 2) {
			throw new Error('Invalid location format');
		}
		
		const userLongitude = parseFloat(locationParts[0]);
		const userLatitude = parseFloat(locationParts[1]);

		const userAge = user.rows[0].age;
		if (ageRange.length !== 2) {
			ageRange.push(userAge - 10);
			ageRange.push(userAge + 10);
		}

		if (locationRadius.length !== 1) {
			locationRadius.push(50);
		}

		const { gender, sexualorientation } = user.rows[0];

		let genderCondition = '';
		if (gender === 'male') {
			if (sexualorientation === 'heterosexual') {
				genderCondition = "AND u.gender = 'female' AND u.sexualOrientation != 'homosexual'";
			} else if (sexualorientation === 'homosexual') {
				genderCondition = "AND u.gender = 'male' AND u.sexualOrientation != 'heterosexual'";
			}
		} else if (gender === 'female') {
			if (sexualorientation === 'heterosexual') {
				genderCondition = "AND u.gender = 'male' AND u.sexualOrientation != 'homosexual'";
			} else if (sexualorientation === 'homosexual') {
				genderCondition = "AND u.gender = 'female' AND u.sexualOrientation != 'heterosexual'";
			}
		}

		let sortCondition = 'ORDER BY common_tag_count DESC, distance ASC, fame DESC';
		if (sort === 'ageasc') {
			sortCondition = 'ORDER BY age ASC';
		}
		else if (sort === 'agedesc') {
			sortCondition = 'ORDER BY age DESC';
		}
		else if (sort === 'fameasc') {
			sortCondition = 'ORDER BY fame ASC';
		}
		else if (sort === 'famedesc') {
			sortCondition = 'ORDER BY fame DESC';
		}
		else if (sort === 'locationasc') {
			sortCondition = 'ORDER BY distance ASC';
		}
		else if (sort === 'locationdesc') {
			sortCondition = 'ORDER BY distance DESC';
		}
		else if (sort === 'tagcount') {
			sortCondition = 'ORDER BY common_tag_count DESC';
		}

		const userTags = tags ? tags : user.rows[0].tags.split(',');

		const fameMin = fameRange.length == 2 ? fameRange[0] : 0;
		const fameMax = fameRange.length == 2 ? fameRange[1] : 100;

		let randomUsersFetched = false;
		let nbUsersNeeded = nbUsers;
		let users: any[] = [];
		let attempts = 0;
		const maxAttempts = 10;
		let emptyReturn = 0;
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

			let randomUsers: any;
			if (tags && tags.length > 0 && locationRadius[0] > 0) {
				console.log("tags required and location radius", tags, locationRadius);
				randomUsers = await pool.query(
					`
						SELECT id, firstname, fame, location, age, distance, common_tag_count
						FROM (
							SELECT u.id, u.firstname, u.fame, u.location, u.age,
							ST_Distance(
								ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
											CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
								ST_MakePoint($4, $3)::geography
							) / 1000 AS distance,
							(
								SELECT COUNT(*) 
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($8::text[])
							) AS common_tag_count
							FROM users u
							WHERE u.id != $1
							AND u.location IS NOT NULL
							AND ST_DWithin(
								ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
											CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
								ST_MakePoint($4, $3)::geography,
								$5 * 1000
							)
							AND (u.age BETWEEN $6 AND $7)
							${alreadySelectedIds ? `AND u.id NOT IN (${alreadySelectedIds.join(',')})` : ''}
							${genderCondition}
							AND (u.fame BETWEEN $9 AND $10)
							AND EXISTS (
								SELECT 1
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($8::text[])
							)
							AND u.nb_photos > 0
						) AS matched_users
						${sortCondition}
						LIMIT $2
					`,
					[userId, nbUsersNeeded, userLatitude, userLongitude, locationRadius[0], ageRange[0], ageRange[1], userTags, fameMin, fameMax]
				);
			} else if (tags && tags.length > 0 && locationRadius[0] === 0) {
				console.log("no location radius but required tags", tags, locationRadius);
				randomUsers = await pool.query(
					`
						SELECT id, firstname, fame, location, age, 
							COALESCE(
								CASE 
								WHEN location IS NULL THEN 0
								ELSE distance
								END, 0
							) AS distance, 
							common_tag_count
						FROM (
							SELECT u.id, u.firstname, u.fame, u.location, u.age,
							CASE
								WHEN u.location IS NOT NULL THEN
								ST_Distance(
									ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
												CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
									ST_MakePoint($4, $3)::geography
								) / 1000
								ELSE NULL
							END AS distance,
							(
								SELECT COUNT(*) 
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($7::text[])
							) AS common_tag_count
							FROM users u
							WHERE u.id != $1
							AND (u.age BETWEEN $5 AND $6)
							${alreadySelectedIds ? `AND u.id NOT IN (${alreadySelectedIds.join(',')})` : ''}
							${genderCondition}
							AND (u.fame BETWEEN $8 AND $9)
							AND EXISTS (
								SELECT 1
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($7::text[])
							)
							AND u.nb_photos > 0
						) AS matched_users
						${sortCondition}
						LIMIT $2
					`,
					[userId, nbUsersNeeded, userLatitude, userLongitude, ageRange[0], ageRange[1], userTags, fameMin, fameMax]
				);
			} else if (locationRadius[0] === 0) {
				console.log("no tags required and no location radius", tags, locationRadius);
				randomUsers = await pool.query(
					`
						SELECT id, firstname, fame, location, age, 
							COALESCE(
								CASE 
								WHEN location IS NULL THEN 0
								ELSE distance
								END, 0
							) AS distance, 
							common_tag_count
						FROM (
							SELECT u.id, u.firstname, u.fame, u.location, u.age,
							CASE
								WHEN u.location IS NOT NULL THEN
								ST_Distance(
									ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
												CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
									ST_MakePoint($4, $3)::geography
								) / 1000
								ELSE NULL
							END AS distance,
							(
								SELECT COUNT(*) 
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($7::text[])
							) AS common_tag_count
							FROM users u
							WHERE u.id != $1
							AND (u.age BETWEEN $5 AND $6)
							${alreadySelectedIds ? `AND u.id NOT IN (${alreadySelectedIds.join(',')})` : ''}
							${genderCondition}
							AND (u.fame BETWEEN $8 AND $9)
							AND u.nb_photos > 0
						) AS matched_users
						${sortCondition}
						LIMIT $2
					`,
					[userId, nbUsersNeeded, userLatitude, userLongitude, ageRange[0], ageRange[1], userTags, fameMin, fameMax]
				);
			} else {
				console.log("default");
				randomUsers = await pool.query(
					`
						SELECT id, firstname, fame, location, age, distance, common_tag_count
						FROM (
							SELECT u.id, u.firstname, u.fame, u.location, u.age,
							ST_Distance(
								ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
											CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
								ST_MakePoint($4, $3)::geography
							) / 1000 AS distance,
							(
								SELECT COUNT(*) 
								FROM unnest(string_to_array(u.tags, ',')) AS user_tag
								WHERE user_tag = ANY($8::text[])
							) AS common_tag_count
							FROM users u
							WHERE u.id != $1
							AND u.location IS NOT NULL
							AND ST_DWithin(
								ST_MakePoint(CAST(SPLIT_PART(u.location, ',', 1) AS DOUBLE PRECISION), 
											CAST(SPLIT_PART(u.location, ',', 2) AS DOUBLE PRECISION))::geography,
								ST_MakePoint($4, $3)::geography,
								$5 * 1000
							)
							AND (u.age BETWEEN $6 AND $7)
							${alreadySelectedIds ? `AND u.id NOT IN (${alreadySelectedIds.join(',')})` : ''}
							${genderCondition}
							AND (u.fame BETWEEN $9 AND $10)
							AND u.nb_photos > 0
						) AS matched_users
						${sortCondition}
						LIMIT $2
					`,
					[userId, nbUsersNeeded, userLatitude, userLongitude, locationRadius[0], ageRange[0], ageRange[1], userTags, fameMin, fameMax]
				);
			}

			if (randomUsers.rows.length === 0) {
				break;
			}

			const likedProfiles = await pool.query(
				'SELECT * FROM profile_liked WHERE user_id = $1 AND deleted_at IS NULL',
				[userId]
			);

			const likedProfilesMap = new Map<number, number>();
			likedProfiles.rows.forEach((row: any) => {
				likedProfilesMap.set(row.liked_user_id, row.user_id);
			});


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
					distance: user.distance.toFixed(2),
					age: user.age,
					common_tag_count: user.common_tag_count
				}
			})

			if (tempUsers.length === 0) {
				emptyReturn++;
			}

			users = users.concat(tempUsers);

			if (emptyReturn > 3) {
				break;
			}
			if (users.length >= nbUsers) {
				randomUsersFetched = true;
			}
			else {
				nbUsersNeeded = nbUsers - users.length;
			}
		}

		if (sort === 'ageasc') {
			users.sort((a, b) => a.age - b.age);
		}
		else if (sort === 'agedesc') {
			users.sort((a, b) => b.age - a.age);
		}
		else if (sort === 'fameasc') {
			users.sort((a, b) => a.fame - b.fame);
		}
		else if (sort === 'famedesc') {
			users.sort((a, b) => b.fame - a.fame);
		}
		else if (sort === 'locationasc') {
			users.sort((a, b) => a.distance - b.distance);
		}
		else if (sort === 'locationdesc') {
			users.sort((a, b) => b.distance - a.distance);
		}
		else if (sort === 'tagcount') {
			users.sort((a, b) => b.common_tag_count - a.common_tag_count);
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
			return NextResponse.json(newGrid.rows[0].id, { status: 200 });
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

		console.log('Query successful:', pairs);
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