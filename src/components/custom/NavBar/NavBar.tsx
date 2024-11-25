'use client';

import React, { useState } from 'react';
import { Button } from "@/ui/button";
import Link from "next/link";

interface NavBarProps {
	className?: string;
	isLoggedIn?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ className, isLoggedIn }) => {

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

	return (
		<div className={`fixed backdrop-blur-sm bg-[#f4f4f4bb] border-b top-0 left-0 right-0 w-[100vw] py-4 px-12 flex items-center justify-between ${className || ""}`}>
			<p className="text-xl font-medium">42Matcha</p>
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