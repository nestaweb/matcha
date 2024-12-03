'use client';
import GridBrowsing from "@/custom/Matcha/GridBrowsing";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RandomUsers {
	id: string,
	fame: number
}

const Matcha: React.FC = () => {
	const [userId, setUserId] = useState('');
	const [nbUsers, setNbUsers] = useState(0);
	const [randomUsers, setRandomUsers] = useState([] as RandomUsers[]);
	const router = useRouter();

	if (!userId) {
		const isLoggedIn = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/isLoggedIn`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setUserId(data);
			}
			else {
				router.push('/login');
			}
		})
	}

	useEffect(() => {
		if (nbUsers === 0) {
			const nbUsersFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getNbUser`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				if (parseInt(data.count) > 1 && parseInt(data.count) < 10) {
					setNbUsers(parseInt(data.count));
				}
				else if (parseInt(data.count) >= 10) {
					setNbUsers(10);
				}
				return data.count;
			})
			.catch((error) => {
				console.error('Error:', error);
				return 0;
			});
		}
	}, [nbUsers]);

	useEffect(() => {
		if (nbUsers > 0 && randomUsers.length === 0) {
			if (!userId || userId === undefined) {
				console.error('Missing User ID');
				return;
			}

			const randomUsersFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getRandomUsers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ encryptedUserId: userId, nbUsers })
			})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				setRandomUsers(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		}
	});

	
	return (
		<GridBrowsing nbUsers={nbUsers} randomUsers={randomUsers} />
	)
}

export default Matcha;