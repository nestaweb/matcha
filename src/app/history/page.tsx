'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/ui/pixelart/background';
import NavBar from '@/custom/NavBar/NavBar';

type notification = {
	type: string,
	title: string,
	date: string
}

const History: React.FC = () => {
	const [userId, setUserId] = useState('');
	const router = useRouter();
	const [dataHistory, setDataHistory] = useState<notification[]>([]);

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
		if (userId && dataHistory.length === 0) {
			fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ encryptedUserId: userId })
			})
			.then(async (response) => {
				if (response.status === 200) {
					const data = await response.json();
					setDataHistory(data);
				}
			})
		}
	}, [userId]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (userId) {
				fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ encryptedUserId: userId })
				})
				.then(async (response) => {
					if (response.status === 200) {
						const data = await response.json();
						setDataHistory(data);
					}
				})
			}
		}, 8000);
		return () => clearInterval(interval);
	}, [userId]);

	const dataSorted = dataHistory.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<Background variant='userProfile'>
			<NavBar isLoggedIn={userId ? true : false} />
			<div className='flex w-2/3 mx-auto p-4 mt-[10vh] relative  flex-col'>
				{
					dataSorted.map((data, index) => {
						const date = new Date(data.date);
						const now = new Date();
						const diff = now.getTime() - date.getTime();
						const minutes = Math.floor(diff / 60000);
						const hours = Math.floor(minutes / 60);
						const days = Math.floor(hours / 24);
						const months = Math.floor(days / 30);
						const years = Math.floor(months / 12);
						return (
							<div key={index} className='flex items-center gap-4 mb-4 w-full'>
								<div className='w-12 h-12 bg-gray-300 rounded-full'></div>
								<div>
									<p className='text-sm font-bold'>{data.title}</p>
									<p className='text-xs text-gray-500'>{
										years > 0 ? `${years} year${years > 1 ? 's' : ''} ago` :
										months > 0 ? `${months} month${months > 1 ? 's' : ''} ago` :
										days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` :
										hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` :
										minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''} ago` :
										`Just now`
									}</p>
								</div>
							</div>
						)
					})
				}
			</div>
		</Background>
	);
}

export default History;