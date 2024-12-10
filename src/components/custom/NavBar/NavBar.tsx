'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/ui/button";
import Link from "next/link";
import { UserRound, MessageCircle, Bell, LandPlot } from 'lucide-react';
import { useRouter } from 'next/navigation';

type notification = {
	type: string,
	title: string,
	date: string
}

interface NavBarProps {
	className?: string;
	isLoggedIn?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ className, isLoggedIn }) => {
	const [page, setPage] = useState('');
	const router = useRouter();
	const [userId, setUserId] = useState('');
	const [dataHistory, setDataHistory] = useState<notification[]>([]);

	const logout = () => {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/logout`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then((response) => {
			if (response.status === 200) {
				window.location.reload();
			}
		})
	}

	setTimeout(() => {
		setPage(window.location.pathname);
	}, 100);

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
		})
	}

	useEffect(() => {
		if (page === "/history") return ;
		const interval = setInterval(() => {
			if (userId) {
				fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/new`, {
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

	return (
		<div className={`fixed backdrop-blur-sm bg-[#f4f4f4bb] border-b top-0 left-0 right-0 w-[100vw] py-4 px-12 flex items-center justify-between ${className || ""}`}>
			<p className="text-xl font-medium">42Matcha</p>
			{
				isLoggedIn ? 
					<div className='flex gap-4'>
						<Link href={"/user/me"} className='flex flex-col items-center'>
							<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
								<UserRound />
							</div>
							<div className={`${page == "/user/me" ? "w-1.5 h-1.5" : "w-0 h-0"} rounded-full bg-foreground transition duration-300 cursor-pointer ease-in-out`}></div>
						</Link>
						<Link href={"/chat"} className='flex flex-col items-center'>
							<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
								<MessageCircle />
							</div>
							<div className={`${page == "/chat" ? "w-1.5 h-1.5" : "w-0 h-0"} rounded-full bg-foreground transition duration-300 cursor-pointer ease-in-out`}></div>
						</Link>
						<Link href={"/history"} className='flex flex-col items-center'>
							<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl relative">
								<Bell />
								{
									dataHistory.length > 0 &&
									<div className='w-2 h-2 absolute rounded-full -top-1 -right-1 bg-red-500 text-primary'></div>
								}
							</div>
							<div className={`${page == "/history" ? "w-1.5 h-1.5" : "w-0 h-0"} rounded-full bg-foreground transition duration-300 cursor-pointer ease-in-out`}></div>
						</Link>
						<Link href={"/matcha"} className='flex flex-col items-center'>
							<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
								<LandPlot />
							</div>
							<div className={`${page == "/matcha" ? "w-1.5 h-1.5" : "w-0 h-0"} rounded-full bg-foreground transition duration-300 cursor-pointer ease-in-out`}></div>
						</Link>
					</div>
				:
					null
			}
			{
				isLoggedIn ? 
					<div onClick={logout}>
						<Button>Logout</Button>
					</div>
				:
					<Link href={"/login"}>
						<Button>Login</Button>
					</Link>
			}
		</div>
	)
}

export default NavBar;