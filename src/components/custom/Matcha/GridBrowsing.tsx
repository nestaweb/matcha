'use client';
import React, { useState, useEffect } from "react";
import { X, Eye, Map, Beef } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/ui/avatar";
import MapView from "./Map";

interface Pair  {
	associated_user_id: string,
	cell1: number,
	cell2: number,
	discovered: boolean,
	grid_id: number,
	id: number
}

interface Cell {
	id: number,
    grid_id: number,
    cell_index: number,
    clicked_at: Date
}

interface GridBrowsingProps {
	pairs: Pair[];
	userId: string;
	gridId: number;
}

const GridBrowsing: React.FC<GridBrowsingProps> = ({ pairs, userId, gridId }) => {
	const [completedPairs, setCompletedPairs] = useState<Pair[]>([]);
	const [clickedCells, setClickedCells] = useState<Set<number>>(new Set());
	const [mapStatus, setMapStatus] = useState<boolean>(false);

	useEffect(() => {
		const fetchCompletedPairs = async () => {
			if (!userId || !gridId) return;
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/getDiscoveredPairs`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ encryptedUserId: userId, gridId }),
				});
				if (response.status === 200) {
					const data: Pair[] = await response.json();
					setCompletedPairs(data);
				}
			} catch (error) {
				console.error("Error fetching completed pairs:", error);
			}
		};
		fetchCompletedPairs();
	}, [userId, gridId]);

	useEffect(() => {
		const fetchClickedCells = async () => {
			if (!userId || !gridId) return;
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/getClickedCells`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ encryptedUserId: userId, gridId }),
				});
				if (response.status === 200) {
					const data: Cell[] = await response.json();
					setClickedCells(new Set(data.map((cell) => cell.cell_index)));
				}
			} catch (error) {
				console.error("Error fetching clicked cells:", error);
			}
		};
		fetchClickedCells();
	}, [userId, gridId]);


	const handleClick = (index: number) => {
		const clickCell = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/setClickedCell`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ encryptedUserId: userId, gridId, cellId: index }),
				});
				if (response.status === 200) {
					const data: Cell = await response.json();
					console.log('Clicked cell:', data);
				}
			} catch (error) {
				console.error("Error clicking cell:", error);
			}
		}
		setClickedCells((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(index)) return newSet;
			newSet.add(index);

			const isPairCompleted = pairs.some(
				(pair) => (pair.cell1 === index || pair.cell2 === index)
			);

			if (isPairCompleted) {
				const newCompletedPair = pairs.find(
					(pair) => (pair.cell1 === index || pair.cell2 === index)
				);
				if (newCompletedPair && !completedPairs.some((pair) => pair.id === newCompletedPair.id)) {
					setCompletedPairs((prevPairs) => [...prevPairs, newCompletedPair]);
					newSet.add(newCompletedPair.cell1 === index ? newCompletedPair.cell2 : newCompletedPair.cell1);
				}
			}
			return newSet;
		});
		clickCell();
	};

	const openProfile = async (id: string) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/openProfile`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, encryptedUserId: userId }),
			});
			if (response.redirected) {
				window.location.href = response.url;
			}
		} catch (error) {
			console.error('Error opening profile:', error);
		}
	};

	return (
		<>
			<div className="w-[80vw] mx-auto flex items-center justify-center mt-[2.5vh] gap-4">
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Map onClick={() => setMapStatus(!mapStatus)}/>
				</div>
				<div className="bg-foreground/90 rounded-3xl px-6 py-2 text-primary">
					<p className="">{completedPairs.length} <span className="text-primary/80">/ {pairs.length} discovered</span></p>
				</div>
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Beef />
				</div>
			</div>
			<div className="w-[80vw] h-[80vh] grid grid-cols-12 grid-rows-8 mx-auto mt-[2vh] border-2 border-foreground/10">
				{
				mapStatus ?
					<div className="col-span-12 row-span-8">
						<MapView />
					</div>
				:
				[...Array(96)].map((_, i) => {
					const pair = pairs.find((p) => p.cell1 === i || p.cell2 === i);
					const isClicked = clickedCells.has(i);
					const isCompleted = pair && completedPairs.some((cp) => cp.id === pair.id);
					return (
						<div
							key={i}
							className={`transition duration-200 ease-linear border flex items-center justify-center cursor-pointer ${
								isCompleted ? 'bg-foreground/90 text-primary border-transparent text-center' : 'bg-primary text-foreground/50'
							}`}
							onClick={() => handleClick(i)}
						>
							{isClicked && !isCompleted && <X />}
							{isCompleted && pair && pair.cell2 === i && (
								<div onClick={() => openProfile(pair.associated_user_id)}>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-primary/10 flex items-center justify-center p-2 rounded-2xl">
									<Eye size={30} />
								</div>
							</div>
							)}
							{isCompleted && pair && pair.cell1 === i && (
								<Avatar className="w-2/3 h-auto">
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							)}
						</div>
					);
				})}
			</div>
		</>
	)
}

export default GridBrowsing;