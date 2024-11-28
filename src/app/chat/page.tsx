'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from "@/ui/pixelart/background";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Ellipsis, Eye, Ban, MessageCircleOff, Phone, Video } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { UserFriendsResponse, EnrichedFriendsResponse } from "@/types/user_friends";
import ChatBox from "@/custom/Chat/ChatBox";

const ChatHome: React.FC = () => {
	const [userId, setUserId] = useState('');
	const [friends, setFriends] = useState([] as UserFriendsResponse[]);
	const [enrichedFriends, setEnrichedFriends] = useState([] as EnrichedFriendsResponse[]);
	const router = useRouter();
	const [selectedFriend, setSelectedFriend] = useState({} as EnrichedFriendsResponse);

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
		if (!userId || !friends) return;
		const getUserFriends = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/getUserFriends`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setFriends(data);
			}
		});
	}, [userId]);

	useEffect(() => {
		if (!friends) return;
		const getEnrichedFriends = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/getEnrichedFriends`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ friends })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setEnrichedFriends(data);
				if (data.length > 0)
					setSelectedFriend(data[0]);
			}
		});
	}, [friends]);
	

	return (
		<Background variant='userProfile'>
			<div className="flex h-[80vh] max-h-[80vh] w-[80vw] max-w-[80vw] border-2 border-foreground/5 bg-[#f4f4f4bb] mx-auto my-[10vh] rounded-xl backdrop-blur overflow-hidden">
				<div className="w-2/6 h-full border-r-2 p-8 py-6 bg-foreground/5 flex flex-col gap-8">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-semibold">Chat <span className="text-foreground/50">({enrichedFriends.length})</span></h1>
						<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
							<Ellipsis />
						</div>
					</div>
					<ScrollArea className="flex flex-col gap-4 h-8/12 overflow-x-scroll">
						{
							enrichedFriends.map((friend) => {
								return (
									friend.gender === "female" ?
									<div key={friend.friend_id} onClick={() => setSelectedFriend(friend)} className={`flex gap-4 items-center ${friend.friend_id == selectedFriend.friend_id ? "bg-foreground/10" : "hover:bg-foreground/10"} p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer`}>
										<Avatar>
											<AvatarImage src="https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350" alt={friend.firstName + " " + friend.lastName} />
											<AvatarFallback>{friend ? friend.firstName : ""}{friend ? friend.lastName : ""}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p className="text-lg font-medium">{friend.firstName} {friend.lastName}</p>
											<p className="text-foreground font-medium">She won&apos;t bite you</p>
										</div>
									</div>
									:
									<div key={friend.friend_id} onClick={() => setSelectedFriend(friend)} className={`flex gap-4 items-center ${friend.friend_id == selectedFriend.friend_id ? "bg-foreground/10" : "hover:bg-foreground/10"} p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer`}>
										<Avatar>
											<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt={friend.firstName + " " + friend.lastName} />
											<AvatarFallback>{friend ? friend.firstName : ""}{friend ? friend.lastName : ""}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<p className="text-lg font-medium">{friend.firstName} {friend.lastName}</p>
											<p className="text-foreground font-medium">He won&apos;t bite you</p>
										</div>
									</div>
								)
							})
						}
					</ScrollArea>
				</div>
				<div className="w-4/6 h-full flex flex-col">
					<div className="h-1/12 p-8 py-5 bg-foreground/5 border-b-2 flex justify-between items-center">
						<div className="flex items-center gap-4">
							<Avatar>
								<AvatarImage src={selectedFriend.gender === "female" ? "https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350" : "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350"} alt="@shadcn" />
								<AvatarFallback>{selectedFriend ? selectedFriend.firstName : ""}{selectedFriend ? selectedFriend.lastName : ""}</AvatarFallback>
							</Avatar>
							<p className="text-lg font-medium">{selectedFriend ? selectedFriend.firstName : ""} {selectedFriend ? selectedFriend.lastName : ""}</p>
						</div>
						<div className="flex gap-8 items-center w-1/2 justify-end">
							<div className="flex items-center gap-2">
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Video className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Phone className="text-foreground/80" size={22} />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Ban className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<MessageCircleOff className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Eye className="text-foreground/80" size={22} />
								</div>
							</div>
						</div>
					</div>
					<ChatBox userId={userId} receiverId={selectedFriend.friend_id} />
				</div>
			</div>
		</Background>
	)
}

export default ChatHome;