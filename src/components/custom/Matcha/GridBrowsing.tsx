'use client';
import React, { useState, useEffect } from "react";
import { X, Eye, Settings2, MessageCircle } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";

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
				body: JSON.stringify({ id }),
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
			<div className="w-[80vw] mx-auto flex items-center justify-between mt-[5vh]">
				<Link href="/chat">
					<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
						<MessageCircle />
					</div>
				</Link>
				<div className="bg-foreground/90 rounded-3xl px-6 py-2 text-primary">
					<p className="">{completedPairs.length} <span className="text-primary/80">/ 10 discovered</span></p>
				</div>
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Settings2 />
				</div>
			</div>
			<div className="w-[80vw] h-[80vh] grid grid-cols-12 grid-rows-8 mx-auto mt-[5vh] border-2 border-foreground/10">
				{[...Array(96)].map((_, i) => {
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
				{/* {
					[...Array(96)].map((_, i) => {
						const pairWithText = [...completedPairs].find(([a, b]) => a === i || b === i);
						const findUserByPair = (pair: Pair | undefined): RandomUsers | null => {
							if (!pair) return null;
							for (const [key, user] of pairUserMap.entries()) {
								if (key[0] === pair[0] && key[1] === pair[1]) {
									return user;
								}
							}
							return null;
						};
						
						const user = findUserByPair(pairWithText);
						const userId = user ? user.id : "";
						const text = pairWithText
						? pairWithText[0] === i
							? 
							<Avatar className="w-2/3 h-auto">
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							:
							<div onClick={() => openProfile(userId)}>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-primary/10 flex items-center justify-center p-2 rounded-2xl">
									<Eye size={30} />
								</div>
							</div>
						: "";
						return (
							<div 
								key={i} 
								className={`transition duration-200 ease-linear border flex items-center justify-center cursor-pointer ${
									clickedCells.has(i) && pairs.some(([a, b]) => a === i || b === i) ? 'bg-foreground/90 text-primary border-transparent text-center' : 'bg-primary text-foreground/50'
								}`}
								onClick={() => handleClick(i)}
							>
								{clickedCells.has(i) && !pairs.some(([a, b]) => a === i || b === i) && <X />}
								{text}
							</div>
						);
					})
				} */}
			</div>
		</>
	)
}

export default GridBrowsing;