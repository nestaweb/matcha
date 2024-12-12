'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/custom/NavBar/NavBar';
import Background from '@/ui/pixelart/background';
import { Button } from '@/ui/button';
import Image from 'next/image';
import { Plus, MessageCircleOff } from 'lucide-react';
import { UserResponse } from '@/types/user';
import { useRouter, useParams } from 'next/navigation';
import { CryptoService } from '@/server/CryptoService';

const ViewUser: React.FC = () => {
	const search = useParams();
	const [userId, setUserId] = useState('');
	const [myUserId, setMyUserId] = useState('');
	const [user, setUser] = useState({} as UserResponse);
	const [tags, setTags] = useState([] as string[]);
	const [friends, setFriends] = useState([] as string[]);
	const [isFriend, setIsFriend] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const router = useRouter();
	const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

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
				if (data) {
					setMyUserId(data);
				}
				else {
					router.push('/login');
				}
				if (search.userId) {
					if (typeof search.userId === 'string') {
						setUserId(search.userId);
					}
					else {
						router.push('/login');
					}
				}
				else {
					router.push('/login');
				}
			}
			else {
				router.push('/login');
			}
		})
	}

	useEffect(() => {
		if (userId && !user.email) {
			const getUser = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUserInfos`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ encryptedUserId: userId })
			})
			.then(async (response) => {
				if (response.status === 200) {
					const data = await response.json();
					setUser(data);
					setTags(data.tags ? data.tags.split(',') : []);
					setFriends(data.friends);
					const lastSeen = data.lastSeen;
					const now = new Date();
					const lastSeenDate = new Date(lastSeen);
					const diff = now.getTime() - lastSeenDate.getTime();
					if (diff < 60000) {
						setIsActive(true);
					}
					console.log(diff, lastSeenDate, now);
				}
			});
			const profileIsLiked = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/isLiked`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
			})
			.then(async (response) => {
				if (response.status === 200) {
					const data = await response.json();
					setIsLiked(data);
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		}
	}, [userId, myUserId, isLiked]);

	useEffect(() => {
		if (!userId || !myUserId) return;
		const setVisitedProdile = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setProfileView`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, visitedProfileId: userId })
		})
	}, [userId, myUserId]);

	useEffect(() => {
		friends.forEach((friend: any) => {
			if (!myUserId.includes('.')) {
				console.error('Invalid ID');
				return;
			}
			const decryptedKeyFriendId = friend.split('.');
			const decryptedFriendId = parseInt(cryptoService.decrypt({ encryptedText: decryptedKeyFriendId[0], iv: decryptedKeyFriendId[1] }));
			if (!userId.includes('.')) {
				console.error('Invalid ID');
				return;
			}
			const decryptedKeyUserId = myUserId.split('.');
			const decryptedUserId = parseInt(cryptoService.decrypt({ encryptedText: decryptedKeyUserId[0], iv: decryptedKeyUserId[1] }));
			if (decryptedFriendId === decryptedUserId) {
				setIsFriend(true);
			}
		});
	}, [friends]);

	function likeProfile() {
		if (!userId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		if (!myUserId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		const likeProfileFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/likeProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				setIsLiked(true);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function unlikeProfile() {
		if (!userId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		if (!myUserId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		const likeProfileFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/unlikeProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				setIsLiked(false);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function unlinkProfile() {
		if (!userId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		if (!myUserId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		const likeProfileFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/unlinkProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				setIsFriend(false);
				setIsLiked(false);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function reportProfile() {
		if (!userId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		if (!myUserId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		const reportProfileFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/reportProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				setIsFriend(false);
				setIsLiked(false);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function blockProfile() {
		if (!userId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		if (!myUserId.includes('.')) {
			console.error('Invalid ID');
			return;
		}
		const blockProfileFetch = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user_friends/blockProfile`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: myUserId, encryptedFriendId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				setIsFriend(false);
				setIsLiked(false);
				router.push('/matcha');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<Background variant='userProfile'>
			<NavBar isLoggedIn={userId ? true : false} />
			<div className='flex justify-between gap-16 p-4 mt-[10vh] relative'>
				<div className='flex flex-col gap-8 bg-[#f4f4f4bb] backdrop-blur rounded-2xl w-2/6 p-6 border-2 border-foreground/5  max-h-[84vh] overflow-x-scroll'>
					<div className='flex gap-8 items-start justify-between'>
						<div className='flex flex-col gap-3'>
							<div className='flex gap-3'>
								{
									isActive &&
									<div className='w-3 h-3 bg-teal-400/30 flex items-center justify-center rounded-full'>
										<div className='w-1.5 h-1.5 bg-teal-400 rounded-full'></div>
									</div>
								}
								{
									!isActive &&
									<div className='w-3 h-3 bg-rose-400/30 flex items-center justify-center rounded-full'>
										<div className='w-1.5 h-1.5 bg-rose-400 rounded-full'></div>
									</div>
								}
								<p className='text-4xl'>{user.firstName} {user.lastName}</p>
								<span className='text-lg -mt-1'>[{user.age}]</span>
							</div>
							{
								user.locationAccess && user.city && user.city.length > 0 &&
								<div className='flex items-center gap-2 px-1 w-fit'>
									<div className='w-3 h-3 bg-teal-400/30 flex items-center justify-center'>
										<div className='w-1.5 h-1.5 bg-teal-400'></div>
									</div>
									<p>{user.city}</p>
								</div>
							}
							{
								!user.locationAccess &&
								<div className='flex items-center gap-2 px-1 w-fit'>
									<div className='w-3 h-3 bg-rose-400/30 flex items-center justify-center'>
										<div className='w-1.5 h-1.5 bg-rose-400'></div>
									</div>
									<p>Not available</p>
								</div>
							}
						</div>
						<div className='text-lg'>{friends.length} <span className='text-sm text-foreground/60'>relation{friends.length > 1 ? 's' : ''}</span></div>
					</div>
					<div className='grid grid-cols-2 gap-2 gap-y-3'>
						{
							user.height && user.height > 0 ?
							<div className='flex items-center w-full justify-between col-start-1 font-medium'>
								<p>Height</p>
								<p>\\</p>
							</div>
							:
							null
						}
						{
							user.height && user.height > 0 ?
							<div className='col-start-2 flex justify-end'>
								<p>{user.height} <span className='text-sm text-foreground/60'>cm</span></p>
							</div>
							:
							null
						}
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Sexual Orientation</p>
							<p>\\</p>
						</div>
						<div className='col-start-2 flex justify-end'>
							<p className={`${user.sexualOrientation != "dontwanttosay" ? 'capitalize' : ""}`}>{user.sexualOrientation != "dontwanttosay" ? user.sexualOrientation : "Don't want to say"}</p>
						</div>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Searching for</p>
							<p>\\</p>
						</div>
						<div className='col-start-2 flex justify-end'>
							<p className='capitalize'>{user.goal}</p>
						</div>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Fame</p>
							<p>\\</p>
						</div>
						<div className='col-start-2 flex justify-end'>
							<p className="">{user.fame} <span className='text-xs text-foreground/70'>/100</span></p>
						</div>
					</div>
					<div className='flex flex-col gap-2 mt-12'>
						<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
							<p>Interests</p>
							<p>\\</p>
						</div>
						<div className='flex flex-wrap gap-2'>
							{
								tags.map((tag, index) => (
									<div key={index} className='bg-foreground/90 backdrop-blur text-primary px-4 py-1 rounded-3xl cursor-default'>
										<p className='flex items-center gap-1'><span className='text-primary/70'>#</span>{tag}</p>
									</div>
								))
							}
						</div>
					</div>
					{
						user.bio && user.bio.length > 0 &&
						<div className='flex flex-col gap-2'>
							<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
								<p>Bio</p>
								<p>\\</p>
							</div>
							<p>
								{user.bio}
							</p>
						</div>
					}
					<div className='flex gap-2'>
						{
							isFriend ?
							<>
								<Button className='w-full text-primary'>Chat</Button>
								<div className='w-1/6'>
									<div onClick={() => unlinkProfile()} className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
										<MessageCircleOff className="text-foreground/80" size={22} />
									</div>
								</div>
							</>
							:
							null
						}
						{
							!isFriend && !isLiked ?
							<Button onClick={() => likeProfile()} className='w-full text-primary'>Like Profile</Button>
							:
							null
						}
						{
							isLiked && !isFriend ?
							<Button onClick={() => unlikeProfile()} className='w-full text-primary'>Unlike profile</Button>
							:
							null
						}
					</div>
					{
						!isFriend ?
						<Button onClick={() => reportProfile()} className='w-full text-primary'>Report Account</Button>
						:
						<Button onClick={() => blockProfile()} className='w-full text-primary'>Block Account</Button>
					}
					
				</div>
				<div className='flex items-end w-4/6 h-[84vh] gap-8'>
					<div className='flex items-center h-full w-2/5 bg-foreground/30 rounded-2xl relative'>
						<Image
							src='/images/pp0.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-cover object-center absolute top-0 left-0 rounded-2xl blur-3xl'
						/>
						<Image
							src='/images/pp0.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp1.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp2.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp3.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
					</div>
					<div className='flex flex-col items-center justify-center bg-foreground/70 h-2/6 rounded-2xl relative flex-1 border-4 border-foreground border-dashed text-primary/70'>
						<Plus size={30} />
					</div>
				</div>
				{/* <div className='z-20 flex flex-col rounded-2xl mr-4 w-[63vw] p-6 border-2 border-foreground/5 h-[84vh] max-h-[84vh] gap-8 overflow-x-scroll absolute right-0 bg-[#f4f4f4bb] backdrop-blur-xl'>
					<h1 className='text-4xl'>Settings</h1>
					<ul>
						<li>email</li>
						<li>password</li>
						<li>notification</li>
						<li>localisation</li>
						<li>delete account</li>
					</ul>
				</div> */}
			</div>
		</Background>
	)
}

export default ViewUser;