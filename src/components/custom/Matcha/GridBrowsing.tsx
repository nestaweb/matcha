'use client';
import React, { useState, useEffect } from "react";
import { X, Eye, Settings2, MessageCircle } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";

type Pair = [number, number];

const GridBrowsing: React.FC = () => {
	const [pairs, setPairs] = useState<Pair[]>([]);
  	const [clickedCells, setClickedCells] = useState<Set<number>>(new Set());
	const [completedPairs, setCompletedPairs] = useState<Set<Pair>>(new Set());

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

	useEffect(() => {
		const newPairs = generateRandomPairs(8, 12, 10);
		setPairs(newPairs);
	}, []);


	const handleClick = (index: number) => {
		setClickedCells((prev) => {
			const newSet = new Set(prev);
			newSet.add(index);

			const completedPairsArray = [...completedPairs];
			let clickedPairs = false;
			completedPairsArray.forEach(([a, b]) => {
				if (newSet.has(a) && newSet.has(b) && (index === a || index === b)) {
					clickedPairs = true;
				}
			})
		
			pairs.forEach(([a, b]) => {
				if (newSet.has(a) && newSet.has(b) && !clickedPairs && (index === a || index === b)) {
					console.log(`Pair clicked: [${a}, ${b}]`);
					setCompletedPairs((prev) => {
						const newSet = new Set(prev);
						newSet.add([a, b]);
						return newSet;
					});
					console.log(completedPairs);
				}
			});
	
		  return newSet;
		});
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
					<p className="">{completedPairs.size} <span className="text-primary/80">/ 10 discovered</span></p>
				</div>
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Settings2 />
				</div>
			</div>
			<div className="w-[80vw] h-[80vh] grid grid-cols-12 grid-rows-8 mx-auto mt-[5vh] border-2 border-foreground/10">
				{
					[...Array(96)].map((_, i) => {
						const pairWithText = [...completedPairs].find(([a, b]) => a === i || b === i);
						const text = pairWithText
						? pairWithText[0] === i
							? 
							<Avatar className="w-2/3 h-auto">
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							:
							<Link href="/user/8723323">
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-primary/10 flex items-center justify-center p-2 rounded-2xl">
									<Eye size={30} />
								</div>
							</Link>
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
				}
			</div>
		</>
	)
}

export default GridBrowsing;