import { useState } from "react";
import Link from "next/link";
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

export const FirstStep: React.FC = () => {
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

export const SecondStep: React.FC = () => {
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

export const ThirdStep: React.FC = () => {
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

export const QuestionOne: React.FC = () => {
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your gender ?</h2>
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

export const QuestionTwo: React.FC = () => {
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your sexual orientation ?</h2>
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

export const QuestionThree: React.FC = () => {
	const [value, setValue] = useState(18);
	const handleChange = (val: number[]) => {
		setValue(val[0]);
	  };
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your age ?</h2>
			<Slider 
				min={18}
				max={90}
				onValueChange={handleChange}
			/>
			<p>selected age : {value}</p>
		</>
	)
}

export const QuestionFour: React.FC = () => {
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

export const QuestionFive: React.FC = () => {
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

export const FourthStep: React.FC = () => {
	return (
		<>
			<h2 className='font-medium text-3xl'>Welcome to 42Matcha</h2>
			<div className='flex flex-col w-2/3 mt-[5vh] z-20 items-center gap-6'>
				<Button>Get started</Button>
			</div>
		</>
	)
}