"use client";

import { useState } from "react";
import Background from '@/ui/pixelart/background';
import Link from "next/link";
import { MoveLeft, User, MailCheck, Rocket, Settings2 } from "lucide-react";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Slider } from "@/ui/slider";
import { TagsInput } from "@/ui/tagsinput";

const Register: React.FC = () => {
	return (
		<Background variant='register'>
			<div className='h-[100vh] flex justify-between'>
				<div className='w-3/12 bg-[#f4f4f4bb] backdrop-blur-lg mt-[2vh] ml-[2vh] h-[96vh] rounded-2xl relative'>
					<div className='absolute bottom-4 px-8 flex items-center justify-between w-full'>
						<div className='cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
						<Link href="/login">
							<div className='cursor-pointer flex gap-2 underline'>Sign in</div>
						</Link>
					</div>
					<div className='flex flex-col gap-12  px-8 pt-6'>
						<h1 className='text-xl'>42Matcha</h1>
						<div className='flex flex-col'>
							<div className='flex gap-4 items-center'>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<User size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Your details</h2>
									<p className='text-sm text-foreground/60'>Provide an email and password</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className='flex gap-4 items-center opacity-40'>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<MailCheck size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Verify your email</h2>
									<p className='text-sm text-foreground/60'>Enter your verification code</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className='flex gap-4 items-center opacity-40'>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<Settings2 size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Set up your preferences</h2>
									<p className='text-sm text-foreground/60'>We would like to know you more</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className='flex gap-4 items-center opacity-40'>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<Rocket size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Welcome to 42Matcha</h2>
									<p className='text-sm text-foreground/60'>Start matching with the world</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='w-9/12 flex justify-center'>
					<div className='flex flex-col w-1/2 mx-auto items-center mt-[13.25vh]'>
						<h2 className='text-lg text-foreground/30'>42Matcha</h2>
						<FourthStep />
					</div>
				</div>
			</div>
		</Background>
	)
}

const FirstStep: React.FC = () => {
	return (
		<>
			<h2 className='font-medium text-3xl'>Create free account</h2>
			<div className='flex flex-col items-center w-2/3 mt-[5vh] z-20'>
				<div className="flex flex-col gap-6 w-full">
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" required />
						<div className="flex gap-2">
							<div className='w-1/4 h-[1.5vh] rounded-xl bg-emerald-500 border border-secondary/20'></div>
							<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
							<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
							<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Continue
					</Button>
					<Button className="w-full">
						Continue with Google
					</Button>
					</div>
					<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Sign in
					</Link>
				</div>
			</div>
		</>
	)
}

const SecondStep: React.FC = () => {
	return (
		<>
			<h2 className='font-medium text-3xl'>Verification code</h2>
			<div className='flex flex-col w-2/3 mt-[5vh] z-20 items-center gap-6'>
				<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
				<Button>Verify</Button>
				<p className='text-center'>Don&apos;t receive ? <Link href="#" className='underline'>Click to resend</Link></p>
			</div>
		</>
	)
}

const ThirdStep: React.FC = () => {
	return (
		<>
			<h2 className='font-medium text-3xl'>Preferences</h2>
			<p className='opacity-60'>Question 2 of 5</p>
			<div className='flex flex-col w-full mt-[5vh] z-20 items-center gap-8'>
				<QuestionFive />
				<Button>Continue</Button>
			</div>
		</>
	)
}

const QuestionOne: React.FC = () => {
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What's your gender ?</h2>
			<div className='flex gap-6'>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Not sure about it</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						<div className='w-11 h-11 bg-foreground/80 rounded-full'></div>
					</div>
					<p className='text-foreground/60 text-center'>Male</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Nonbinary</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Female</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Don&apos;t want to say</p>
				</div>
			</div>
		</>
	)
}

const QuestionTwo: React.FC = () => {
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What's your sexual orientation ?</h2>
			<div className='flex gap-6'>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Heterosexual</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						<div className='w-11 h-11 bg-foreground/80 rounded-full'></div>
					</div>
					<p className='text-foreground/60 text-center'>Homosexual</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Bisexual</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Asexual</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Don&apos;t want to say</p>
				</div>
			</div>
		</>
	)
}

const QuestionThree: React.FC = () => {
	const [value, setValue] = useState(18);
	const handleChange = (val: number[]) => {
		setValue(val[0]);
	  };
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What's your age ?</h2>
			<Slider 
				min={18}
				max={90}
				onValueChange={handleChange}
			/>
			<p>selected age : {value}</p>
		</>
	)
}

const QuestionFour: React.FC = () => {
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What are you searching for ?</h2>
			<div className='flex gap-6'>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Friend</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Date</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						{/* <div className='w-11 h-11 bg-foreground/80 rounded-full'></div> */}
					</div>
					<p className='text-foreground/60 text-center'>Sex</p>
				</div>
				<div className='flex flex-col gap-2 items-center'>
					<div className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
						<div className='w-11 h-11 bg-foreground/80 rounded-full'></div>
					</div>
					<p className='text-foreground/60 text-center'>Serious</p>
				</div>
			</div>
		</>
	)
}

const QuestionFive: React.FC = () => {
	const [value, setValue] = useState<string[]>([]);

	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What points of interests ?</h2>
			<TagsInput
				value={value}
				onValueChange={setValue}
				placeholder="enter your points of interests"
				className="w-2/3"
			/>
		</>
	)
}

const FourthStep: React.FC = () => {
	return (
		<>
			<h2 className='font-medium text-3xl'>Welcome to 42Matcha</h2>
			<div className='flex flex-col w-2/3 mt-[5vh] z-20 items-center gap-6'>
				<Button>Get started</Button>
			</div>
		</>
	)
}

export default Register;