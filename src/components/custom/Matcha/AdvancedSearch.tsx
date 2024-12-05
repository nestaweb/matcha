'use client';
import React, { useState, useEffect } from "react";
import { Eye, RotateCcw, Settings2 } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/ui/avatar";
import { CryptoService } from "@/server/CryptoService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TagsInput } from "@/ui/tagsinput";
import { Label } from "@/components/ui/label";
import { DualRangeSlider } from '@/ui/dualRangeSlider';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
	setGridId: (gridId: number) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ pairs, userId, gridId, setGridId }) => {
	const [enrichedPairs, setEnrichedPairs] = useState<EnrichedUser[]>([]);
	const [ageRange, setAgeRange] = useState([18, 100]);
	const [fameRange, setFameRange] = useState([0, 100]);
	const [locationRadius, setLocationRadius] = useState([50]);
	const [tags, setTags] = useState<string[]>([]);
	const [sort, setSort] = useState<string>('all');
	const [completedPairs, setCompletedPairs] = useState<Pair[]>([]);
	const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

	useEffect(() => {
		const fetchEnrichedPairs = async () => {
			if (!userId) return;
			if (pairs === undefined ) return;
			const idsList = pairs.map(pair => pair.associated_user_id);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/enrichUsers`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ encryptedUserId: userId, idsList }),
				});
				if (response.status === 200) {
					const data: EnrichedUser[] = await response.json();
					const decryptedIds = pairs.map(pair => {
						const cryptedId = pair.associated_user_id.split('.');
						const cryptedKeyId = { encryptedText: cryptedId[0], iv: cryptedId[1] };
						return parseInt(cryptoService.decrypt(cryptedKeyId));
					});
					const sortedData = data.sort((a, b) => {
						const decryptedIdAString = a.id.split('.');
						const decryptedIdAKey = { encryptedText: decryptedIdAString[0], iv: decryptedIdAString[1] };
						const decryptedIdA = parseInt(cryptoService.decrypt(decryptedIdAKey));
						const decryptedIdBString = b.id.split('.');
						const decryptedIdBKey = { encryptedText: decryptedIdBString[0], iv: decryptedIdBString[1] };
						const decryptedIdB = parseInt(cryptoService.decrypt(decryptedIdBKey));
						return decryptedIds.indexOf(decryptedIdA) - decryptedIds.indexOf(decryptedIdB);
					});
					setEnrichedPairs(sortedData);
				}
			} catch (error) {
				console.error("Error fetching enriched pairs:", error);
			}
		};
		fetchEnrichedPairs();
	}, [pairs]);

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

	const openProfile = async (id: string) => {
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
			if (!discoveredPair) return;
			const setPairDiscovered = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/setDiscoveredPairs`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ encryptedUserId: userId, gridId, pair_id: discoveredPair.id }),
			});
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

	const newGrid = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matcha/newGrid`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ encryptedUserId: userId, ageRange, fameRange, locationRadius, tags, sort }),
			});
			if (response.status === 200) {
				const data = await response.json();
				setGridId(data);
			}
		} catch (error) {
			console.error('Error creating new grid:', error);
		}
	}

	return (
		<>
			<div className="w-[80vw] mx-auto flex items-center justify-center mt-[2.5vh] gap-4">
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<RotateCcw onClick={() => newGrid()}/>
				</div>
				<div className="bg-foreground/90 rounded-3xl px-6 py-2 text-primary">
					<p className="">{completedPairs.length} <span className="text-primary/80">/ {pairs.length} discovered</span></p>
				</div>
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<Dialog>
						<DialogTrigger asChild>
							<Settings2 />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Advanced Search</DialogTitle>
								<DialogDescription>
									Search for users based on your preferences
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-12 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="name" className="text-right">
										Age
									</Label>
									<DualRangeSlider
										label={(value) => value}
										value={ageRange}
										onValueChange={setAgeRange}
										min={18}
										max={100}
										step={1}
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Fame
									</Label>
									<DualRangeSlider
										label={(value) => value}
										value={fameRange}
										onValueChange={setFameRange}
										min={0}
										max={100}
										step={1}
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Location
									</Label>
									<DualRangeSlider
										label={(value) => value}
										value={locationRadius}
										onValueChange={setLocationRadius}
										min={0}
										max={200}
										step={1}
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Tags
									</Label>
									<TagsInput
										onValueChange={setTags}
										className="col-span-3"
										value={tags}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right">
										Sort
									</Label>
									<Select value={sort} onValueChange={setSort}>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select a sort" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="all">All</SelectItem>
												<SelectItem value="agedesc">Age desc</SelectItem>
												<SelectItem value="ageasc">Age asc</SelectItem>
												<SelectItem value="famedesc">Fame desc</SelectItem>
												<SelectItem value="fameasc">Fame asc</SelectItem>
												<SelectItem value="locationdesc">Location desc</SelectItem>
												<SelectItem value="locationasc">Location asc</SelectItem>
												<SelectItem value="tagcount">Common tags</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={() => newGrid()}>Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div className="w-[80vw] h-[80vh] mx-auto mt-[2vh] border-2 border-foreground/10 relative z-20">
			{
				enrichedPairs.map((pair, index) => {
					const isDiscovered = completedPairs.some((cp) => {
						const cryptedId = cp.associated_user_id.split('.');
						const cryptedKeyId = { encryptedText: cryptedId[0], iv: cryptedId[1] };
						const decryptedId = parseInt(cryptoService.decrypt(cryptedKeyId));
						const decryptedPairId = pair.id.split('.');
						const decryptedKeyId = { encryptedText: decryptedPairId[0], iv: decryptedPairId[1] };
						const decryptedIdPair = parseInt(cryptoService.decrypt(decryptedKeyId));
						return decryptedId === decryptedIdPair;
					});
					return (
					<div key={index} className={`grid grid-cols-6 w-full items-center border-b-2 border-foreground/20 p-3 px-4 ${isDiscovered ? "" : "bg-foreground/90 text-primary"}`}>
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
							<p className={`${isDiscovered ? "text-foreground/70" : "text-primary/70"} text-sm`}>age</p>
						</div>
						<div className="flex flex-col">
							<p>{pair.active ? "Active" : "Inactive"}</p>
							<p className={`${isDiscovered ? "text-foreground/70" : "text-primary/70"} text-sm`}>status</p>
						</div>
						<div className="flex flex-col">
							<p>{pair.fame}</p>
							<p className={`${isDiscovered ? "text-foreground/70" : "text-primary/70"} text-sm`}>fame</p>
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