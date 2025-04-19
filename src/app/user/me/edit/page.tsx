'use client';

import NavBar from '@/custom/NavBar/NavBar';
import Background from '@/ui/pixelart/background';
import { Button } from '@/ui/button';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { Input } from '@/ui/input';
import { Textarea } from "@/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UserResponse } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from "@/components/ui/dialog";
import Link from "next/link";

type picture = {
	uploadPath: string;
	imageBuffer: Buffer;
}

const editUserFormSchema = z.object({
	firstName: z.string()
		.max(15, {
			message: "First name must be at most 15 characters."
		})
		.min(2, {
			message: "First name must be at least 2 characters."
		}),
	lastName: z.string()
		.max(15, {
			message: "Last name must be at most 15 characters."
		})
		.min(2, {
			message: "Last name must be at least 2 characters."
		}),
	age: z.number()
		.min(18, {
			message: "You must be at least 18 years old."
		}),
	height: z.number(),
	sexualOrientation: z.string(),
	searchingFor: z.string(),
	tags: z.array(z.string()),
	bio: z.string(),
})

const tagsFormSchema = z.object({
	tag: z.string()
		.max(10, {
			message: "Tag must be at most 10 characters."
		})
		.min(2, {
			message: "Tag must be at least 2 characters."
		})
		.regex(/^[a-zA-Z0-9_]*$/, {
			message: "Tag must not have special characters."
		})
})

const sensitiveFormSchema = z.object({
	email: z.string().email({
		message: "Invalid email address.",
	})
})

const EditUser: React.FC = () => {
	const [userId, setUserId] = useState('');
	const [user, setUser] = useState({} as UserResponse);
	const [tags, setTags] = useState([] as string[]);
	const router = useRouter();
	const [locationEnabled, setLocationEnabled] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [files, setFiles] = useState<picture[]>([]);
	const [photos, setPhotos] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [googlePhotosOpen, setGooglePhotosOpen] = useState(false);
	const [nextPageToken, setNextPageToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

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
					setLocationEnabled(data.locationAccess);
				}
			});
		}
	}, [userId]);

	function enableLocation() {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLocationAccess`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, access: 'granted' })
		})
		setLocationEnabled(true);
		setUser({...user, locationAccess: true});
	}

	function disableLocation() {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserLocationAccess`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, access: 'denied' })
		})
		setLocationEnabled(false);
		setUser({...user, locationAccess: false});
	}
	
	function onSubmit(values: z.infer<typeof editUserFormSchema>) {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserProfileInfos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ encryptedUserId: userId, ...values }),
		}).then((response) => {
			if (response.status === 200) {
				router.push('/user/me');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const userEditForm = useForm<z.infer<typeof editUserFormSchema>>({
		resolver: zodResolver(editUserFormSchema),
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			height: user.height,
			sexualOrientation: user.sexualOrientation,
			searchingFor: user.goal,
			tags: tags,
			bio: user.bio
		},
	});
	
	useEffect(() => {
		if (user.sexualOrientation && user.goal) {
			userEditForm.reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				age: user.age || 0,
				height: user.height || 0,
				sexualOrientation: user.sexualOrientation,
				searchingFor: user.goal,
				tags: tags,
				bio: user.bio || ""
			});
		}
	}, [user]);

	function deleteTag(index: number) {
		if (index < 0) return;
		if (index >= tags.length) return;
		if (tags.length === 0) return;
		if (tags.length === 1) {
			alert('You must have at least one tag');
			return;
		}
		const newTags = tags.filter((_, i) => i !== index);
		setTags(newTags);
		userEditForm.setValue('tags', newTags);
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserTags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, tags: newTags.join(',') })
		})
		return ;
	}

	const tagForm = useForm<z.infer<typeof tagsFormSchema>>({
		resolver: zodResolver(tagsFormSchema),
		defaultValues: {
			tag: ''
		}
	});

	function addTag(values: z.infer<typeof tagsFormSchema>) {
		const newTag = values.tag;
		if (tags.includes(newTag)) {
			alert('This tag already exists');
			return;
		}
		const newTags = [...tags, newTag];
		setTags(newTags);
		userEditForm.setValue('tags', newTags);
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserTags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, tags: newTags.join(',') })
		})
		tagForm.reset();
	}

	const handleUpload = async () => {
		if (!file) return;
	
		const formData = new FormData();
		formData.append('file', file);
		formData.append('encryptedUserId', userId);
	
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/uploadPicture`, {
				method: 'POST',
				body: formData,
			});
	
			if (response.ok) {
				alert('Image uploaded successfully!');
				setFile(null);
			} else {
				const error = await response.json();
				alert(`Upload failed: ${error.message}`);
			}
		} catch (error) {
			console.error('Upload error:', error);
		}
	};
	
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
			const maxSize = 5 * 1024 * 1024; // 5MB
	
			if (!allowedTypes.includes(selectedFile.type)) {
				alert('Only JPEG, PNG, or GIF files are allowed.');
				return;
			}
	
			if (selectedFile.size > maxSize) {
				alert('File size must not exceed 5MB.');
				return;
			}
	
			setFile(selectedFile);
		}
	};

	const deletePicture = (path: string) => {
		const fileNumber = path.split('/').pop()?.split('.')[0];
		if (!fileNumber) return;
		
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/deletePicture`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId, imagePath: fileNumber })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setFiles(data);
				setFile(null);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}


	useEffect(() => {
		if (!userId) return;
		const getUserPictures = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getPictures`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedUserId: userId })
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setFiles(data);
			}
		});
	}, [file, userId, googlePhotosOpen]);

	const sensitiveForm = useForm<z.infer<typeof sensitiveFormSchema>>({
		resolver: zodResolver(sensitiveFormSchema),
		defaultValues: {
			email: user.email || "",
		},
	});

	const changePasswordOrEmail = (values: z.infer<typeof sensitiveFormSchema>) => {
		const { email } = values;
		const changeEmail = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/setUserEmail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ encryptedUserId: userId, newEmail: email }),
		})
		.then((response) => {
			if (response.redirected) {
				window.location.href = response.url;
			}
		})
	}

	useEffect(() => {
		const fetchPhotos = async () => {
			if (!googlePhotosOpen) return;
			
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUsersPhotos`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ userId, pageToken: null }),
				});
				
				const data = await response.json();

				
				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch photos');
				}
				
				setPhotos(data || []);
				setNextPageToken(data.nextPageToken);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPhotos();
	}, [googlePhotosOpen, userId]);

	const loadMorePhotos = async () => {
		console.log("check for nextPageToken and loading state", nextPageToken, loading);
		if (!nextPageToken || loading) return;
		
		setLoading(true);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUsersPhotos`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId, pageToken: nextPageToken }),
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch more photos');
			}

			
			setPhotos(prev => [...prev, ...(data.mediaItems || [])]);
			setNextPageToken(data.nextPageToken);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	async function downloadGooglePhoto(photoUrl: string, encryptedUserId: string) {
		try {
			const response = await fetch('/api/users/downloadGooglePhotos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ photoUrl, encryptedUserId }),
			});
	
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
	
			const data = await response.json();
			setGooglePhotosOpen(false);
			alert('Image uploaded successfully!');
		} catch (error) {
			console.error('Error downloading Google Photo:', error);
		}
	}
	

	return (
		<Background variant='userProfile'>
			<NavBar isLoggedIn={userId ? true : false} />
			<div className='flex justify-between gap-16 p-4 mt-[10vh]'>
				<Form {...userEditForm}>
					<form onSubmit={userEditForm.handleSubmit(onSubmit)} className='flex flex-col gap-8 bg-[#f4f4f4bb] backdrop-blur rounded-2xl w-2/6 p-6 border-2 border-foreground/5 max-h-[84vh] overflow-x-scroll'>
						<div className='flex gap-8 items-start justify-between'>
							<div className='flex flex-col gap-3'>
								<div className='flex gap-3 w-2/3'>
									<FormField
										control={userEditForm.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input className='text-4xl py-3 md:text-2xl' {...field} defaultValue={user.firstName} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={userEditForm.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input className='text-4xl py-3 md:text-2xl' {...field} defaultValue={user.lastName} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{
									user.locationAccess && user.city && user.city.length > 0 &&
									<div className='flex items-center gap-2 px-1 w-fit cursor-pointer' onClick={disableLocation}>
										<div className='w-3 h-3 bg-teal-400/30 flex items-center justify-center'>
											<div className='w-1.5 h-1.5 bg-teal-400'></div>
										</div>
										<p>{user.city} - Click to disable</p>
									</div>
								}
								{
									!user.locationAccess && !locationEnabled && 
									<div className='flex items-center gap-2 px-1 w-fit cursor-pointer' onClick={enableLocation}>
										<div className='w-3 h-3 bg-rose-400/30 flex items-center justify-center'>
											<div className='w-1.5 h-1.5 bg-rose-400'></div>
										</div>
										<p>Click to enable Location</p>
									</div>
								}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-2 gap-y-3'>
							<div className='flex items-center w-full justify-between col-start-1 font-medium'>
								<p>Age</p>
								<p>\\</p>
							</div>
							<div className='col-start-2 flex justify-end'>
								<FormField
									control={userEditForm.control}
									name="age"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input type='number' className='text-right' {...field} defaultValue={user.age} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex items-center w-full justify-between col-start-1 font-medium'>
								<p>Height</p>
								<p>\\</p>
							</div>
							<div className='col-start-2 flex justify-end items-center'>
								<FormField
									control={userEditForm.control}
									name="height"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input type='number' className='text-right' {...field} defaultValue={user.height} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex items-center w-full justify-between col-start-1 font-medium'>
								<p>Sexual Orientation</p>
								<p>\\</p>
							</div>
							<div className='col-start-2 flex justify-end'>
								<FormField
									control={userEditForm.control}
									name="sexualOrientation"
									render={({ field }) => {
										return (
										<FormItem className='w-full'>
											<FormControl className='w-full'>
												<Select {...field} value={field.value} onValueChange={(value) => field.onChange(value)}>
													<SelectTrigger className="text-right w-full">
														<SelectValue placeholder="" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="heterosexual">Heterosexual</SelectItem>
														<SelectItem value="homosexual">Homosexual</SelectItem>
														<SelectItem value="bisexual">Bisexual</SelectItem>
														<SelectItem value="asexual">Asexual</SelectItem>
														<SelectItem value="dontwanttosay">Don&apos;t want to say it</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}}
								/>
								
							</div>
							<div className='flex items-center w-full justify-between col-start-1 font-medium'>
								<p>Searching for</p>
								<p>\\</p>
							</div>
							<div className='col-start-2 flex justify-end'>
								<FormField
									control={userEditForm.control}
									name="searchingFor"
									render={({ field }) => {
										return (
										<FormItem className='w-full'>
											<FormControl className='w-full'>
												<Select {...field}  value={field.value} onValueChange={(value) => field.onChange(value)}>
													<SelectTrigger className="text-right w-full">
														<SelectValue placeholder="" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="friend">Friends</SelectItem>
														<SelectItem value="date">Date</SelectItem>
														<SelectItem value="sex">Sex</SelectItem>
														<SelectItem value="love">Love</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}}
								/>
							</div>
						</div>
						<div className='flex flex-col gap-2 mt-2'>
							<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
								<p>Interests</p>
								<p>\\</p>
							</div>
							<div className='flex flex-wrap gap-2'>
								{
									tags.map((tag, index) => (
										<div key={index} className='bg-foreground/90 text-primary px-4 py-1 rounded-3xl cursor-default relative'>
											<p className='flex items-center gap-1'><span className='text-primary/70'>#</span>{tag}</p>
											<div className='absolute -top-2 -right-2 border-2 border-foreground bg-primary/90 p-1 rounded-full text-foreground' onClick={() => deleteTag(index)}><X size={15} /></div>
										</div>
									))
								}
								<Dialog>
									<DialogTrigger>
										<div className='flex bg-foreground/70 text-primary px-4 py-1 rounded-3xl cursor-default relative items-center border-2 border-dashed border-foreground'>
											<p className='flex items-center gap-1 justify-center text-primary/90'><Plus size={15} /></p>
										</div>
									</DialogTrigger>
									<DialogContent>
										<Form {...tagForm}>
											<form onSubmit={tagForm.handleSubmit(addTag)} className='flex flex-col gap-4'>
												<DialogHeader>
													<DialogTitle>Add a new tag</DialogTitle>
													<DialogDescription>Tell your friends about your interests !</DialogDescription>
												</DialogHeader>
												<div className='flex gap-3 items-center w-full'>
													<p className='text-foreground/60'>#</p>
													<FormField
														control={tagForm.control}
														name="tag"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Input {...field} className='w-full' />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<DialogFooter>
													<Button type="button" onClick={tagForm.handleSubmit(addTag)}>Add</Button>
												</DialogFooter>
											</form>
										</Form>
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
								<p>Bio</p>
								<p>\\</p>
							</div>
							<FormField
								control={userEditForm.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea  {...field} defaultValue={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas recusandae deleniti sint pariatur soluta cum veniam officia consectetur explicabo tenetur laborum similique nesciunt, odit labore? Beatae qui officiis temporibus omnis."} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Dialog>
								<DialogTrigger>
									<Button type='button'>Change password OR email</Button>
								</DialogTrigger>
								<DialogContent>
									<Form {...sensitiveForm}>
										<form onSubmit={sensitiveForm.handleSubmit(changePasswordOrEmail)} className='flex flex-col gap-4'>
											<DialogHeader>
												<DialogTitle>Change your email or your password here</DialogTitle>
												<DialogDescription>Tell your friends about your interests !</DialogDescription>
											</DialogHeader>
											<div className='flex flex-col gap-3 justify-center w-full'>
												<FormField
													control={sensitiveForm.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Email</FormLabel>
															<FormControl>
																<Input defaultValue={user.email} type='email' {...field} className='w-full' />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Link href="/passwordReset" className="ml-auto inline-block text-sm underline">
													Forgot your password?
												</Link>
											</div>
											<DialogFooter>
												<Button type="button" onClick={sensitiveForm.handleSubmit(changePasswordOrEmail)}>Change</Button>
											</DialogFooter>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
						</div>
						<div className='flex gap-2'>
							<Button className='w-full'>Save Profile</Button>
						</div>
					</form>
				</Form>
				<div className='flex items-end w-4/6 h-[84vh] gap-8'>
				{
					files.map((file, index) => {
						const imageBuffer = file.imageBuffer;
						return (
						index === 0 ?
						<div className='flex items-center h-full w-2/5 bg-foreground/30 rounded-2xl relative'>
							<Image
								src={imageBuffer.toString()}
								width={450}
								height={400}
								alt='profile picture'
								className='w-full h-full object-cover object-center absolute top-0 left-0 rounded-2xl blur-3xl'
							/>
							<Image
								src={imageBuffer.toString()}
								width={450}
								height={400}
								alt='profile picture'
								className='w-full h-full object-contain object-center z-10'
							/>
							<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full z-20' onClick={() => deletePicture(file.uploadPath)}><X size={20} /></div>
						</div>
						:
						<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
							<Image
								src={imageBuffer.toString()}
								width={450}
								height={400}
								alt='profile picture'
								className='w-full h-full object-contain object-center z-10'
							/>
							<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full z-20' onClick={() => deletePicture(file.uploadPath)}><X size={20} /></div>
						</div>
					)})
				}
				{
					[...Array(5 - files.length)].map((_, index) => (
						index === 0 ?
						<div key={index} className='flex flex-col items-center justify-center bg-foreground/70 h-2/6 rounded-2xl relative flex-1 border-4 border-foreground border-dashed text-primary/70'>
							<label className='flex flex-col items-center gap-2 cursor-pointer'>
								<input className='hidden' type="file" accept="image/*" onChange={handleFileChange} />
								<Plus size={30} />
								<span className='text-sm'>Upload from device</span>
							</label>
							
							<button 
								onClick={handleUpload} 
								disabled={!file}
								className='mt-2 px-4 py-2 bg-primary text-foreground rounded-lg disabled:opacity-50'
							>
								Upload
							</button>

							<Dialog open={googlePhotosOpen} onOpenChange={setGooglePhotosOpen}>
								<DialogTrigger asChild>
									<button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
										Import from Google Photos
									</button>
								</DialogTrigger>
								<DialogContent className='max-w-4xl'>
									<DialogHeader>
										<DialogTitle>Select photos from Google Photos</DialogTitle>
										<DialogDescription>
											Choose photos to add to your profile. You can select multiple photos.
										</DialogDescription>
									</DialogHeader>
									{error && (
										<div className='p-4 bg-red-100 text-red-700 rounded-lg'>
											{error}
										</div>
									)}
									{loading && photos.length === 0 ? (
										<div className='flex items-center justify-center p-8'>
											<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
										</div>
									) : photos.length > 0 ? (
										<>
											<div className='grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4'>
												{photos.map((photo, index) => (
													<div 
														key={index} 
														onClick={() => downloadGooglePhoto(photo.baseUrl, userId)}
														className='relative aspect-square cursor-pointer group hover:opacity-90 transition-opacity'
													>
														<img 
															src={photo.baseUrl} 
															alt={`Photo ${index + 1}`}
															className='w-full h-full object-cover rounded-lg'
														/>
														<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center'>
															<Plus size={24} className='text-white' />
														</div>
													</div>
												))}
											</div>
											{nextPageToken && (
												<div className='flex justify-center mt-4'>
													<button
														onClick={loadMorePhotos}
														disabled={loading}
														className='px-4 py-2 bg-primary text-foreground rounded-lg disabled:opacity-50'
													>
														{loading ? 'Loading...' : 'Load More'}
													</button>
												</div>
											)}
										</>
									) : (
										<div className='flex flex-col items-center justify-center p-8 text-center'>
											<p className='text-lg text-foreground/70'>No photos available in your Google Photos library.</p>
											<p className='text-sm text-foreground/50 mt-2'>Make sure you have photos in your Google Photos account.</p>
										</div>
									)}
								</DialogContent>
							</Dialog>
						</div>
						:
						<div className='flex flex-col items-center justify-center bg-foreground/70 h-2/6 rounded-2xl relative flex-1 border-4 border-foreground border-dashed text-primary/70'>
							<Plus size={30} />
						</div>
					))
				}
				</div>
			</div>
		</Background>
	)
}

export default EditUser;