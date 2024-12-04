'use client';
import GridBrowsing from "@/custom/Matcha/GridBrowsing";
import AdvancedSearch from "@/custom/Matcha/AdvancedSearch";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Switch } from "@/ui/switch"
import { Label } from "@/ui/label"
import { MessageCircle } from "lucide-react";

interface Pair  {
	associated_user_id: string,
	cell1: number,
	cell2: number,
	discovered: boolean,
	grid_id: number,
	id: number
}

const Matcha: React.FC = () => {
	const [userId, setUserId] = useState('');
	const [gridId, setGridId] = useState(0);
	const [pairs, setPairs] = useState<Pair[]>([]);
	const [mode, setMode] = useState('grid');
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
		if (!userId) return;
		const initGrid = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/initgrid`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setGridId(data);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	});

	useEffect(() => {
		if (gridId === 0) return;
		const getPairs = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/getPairs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, gridId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setPairs(data);
			}
		})
	}, [gridId]);

	
	return (
		<>
			<div className="w-[80vw] mx-auto flex items-center justify-between mt-[5vh]">
				<Link href="/chat">
					<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
						<MessageCircle />
					</div>
				</Link>
				<div className="flex items-center gap-2">
					<Switch
						id="airplane-mode"
						onCheckedChange={() => setMode(mode === 'grid' ? 'advanced' : 'grid')}
					/>
      				<Label htmlFor="airplane-mode">Advanced Mode</Label>
				</div>
			</div>
			{
				mode === 'grid' ? (
					<GridBrowsing pairs={pairs} userId={userId} gridId={gridId} />
				) : (
					<AdvancedSearch pairs={pairs} userId={userId} gridId={gridId} />
				)
			}
		</>
	)
}

export default Matcha;