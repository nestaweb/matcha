'use client';
import React, { useState, useEffect } from "react";
import { Eye, RotateCcw, Beef, Settings2 } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/ui/avatar";
import { CryptoService } from "@/server/CryptoService";
import { Button } from "@/ui/button";

interface Pair  {
	associated_user_id: string,
	cell1: number,
	cell2: number,
	discovered: boolean,
	grid_id: number,
	id: number
}

interface EnrichedUser {
	id: string;
	active: string;
	age: number;
	firstName: string;
	lastName: string;
	fame: number;
}

interface AdvancedSearchProps {
	pairs: Pair[];
	userId: string;
	gridId: number;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ pairs, userId, gridId }) => {
	const [enrichedPairs, setEnrichedPairs] = useState<EnrichedUser[]>([]);
	const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

	useEffect(() => {
		const fetchEnrichedPairs = async () => {
			if (!userId) return;
			if (pairs.length === 0) return;
			const idsList = pairs.map(pair => pair.associated_user_id);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/enrichUsers`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ encryptedUserId: userId, idsList }),
				});
				if (response.status === 200) {
					const data: EnrichedUser[] = await response.json();
					console.log(data);
					setEnrichedPairs(data);
				}
			} catch (error) {
				console.error("Error fetching enriched pairs:", error);
			}
		};
		fetchEnrichedPairs();
	}, [pairs]);

	const openProfile = async (id: string) => {
		console.log('Opening profile:', id);
		try {
			const discoveredPair = pairs.find(pair => {
				const cryptedId = pair.associated_user_id.split('.');
				const cryptedKeyId = { encryptedText: cryptedId[0], iv: cryptedId[1] };
				const decryptedId = parseInt(cryptoService.decrypt(cryptedKeyId));
				const cryptedIdToOpen = id.split('.');
				const cryptedKeyIdToOpen = { encryptedText: cryptedIdToOpen[0], iv: cryptedIdToOpen[1] };
				const decryptedIdToOpen = parseInt(cryptoService.decrypt(cryptedKeyIdToOpen));
				return decryptedId === decryptedIdToOpen;
			});
			console.log('Discovered pair:', discoveredPair);
			if (!discoveredPair) return;
			const setPairDiscovered = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/setDiscoveredPairs`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ encryptedUserId: userId, gridId, pair_id: discoveredPair.id }),
			});
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
			<div className="w-[80vw] mx-auto flex items-center justify-center mt-[2.5vh] gap-4">
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<RotateCcw />
				</div>
				<div className="bg-foreground/90 rounded-3xl px-6 py-2 text-primary">
					<p className="">0 <span className="text-primary/80">/ {pairs.length} discovered</span></p>
				</div>
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Settings2 />
				</div>
			</div>
			<div className="w-[80vw] h-[80vh] mx-auto mt-[2vh] border-2 border-foreground/10 relative z-20">
			{
				enrichedPairs.map((pair, index) => {
					return (
					<div key={index} className="grid grid-cols-6 w-full items-center border-b-2 border-foreground/20 p-3 px-4">
						<div className="flex items-center gap-3 col-span-2">
							<Avatar className="w-[10%] h-auto">
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<p>
								{pair.firstName} {pair.lastName}
							</p>
						</div>
						<div className="flex flex-col">
							<p>{pair.age}</p>
							<p className="text-foreground/70 text-sm">age</p>
						</div>
						<div className="flex flex-col">
							<p>{pair.active ? "Active" : "Inactive"}</p>
							<p className="text-foreground/70 text-sm">status</p>
						</div>
						<div className="flex flex-col">
							<p>{pair.fame}</p>
							<p className="text-foreground/70 text-sm">fame</p>
						</div>
						<div onClick={() => openProfile(pair.id)}>
							<div className="relative transition duration-300 cursor-pointer ease-in-out hover:bg-primary/30 flex items-center justify-center p-2 rounded-2xl z-10">
								<Eye size={30} />
							</div>
						</div>
					</div>
				)})
			}
			</div>
		</>
	)
}

export default AdvancedSearch;