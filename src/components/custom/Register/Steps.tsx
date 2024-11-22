"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot
} from "@/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Slider } from "@/ui/slider";
import { TagsInput } from "@/ui/tagsinput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const registerFormSchema = z.object({
	firstName: z.string().min(2, {
	  message: "First Name must be at least 2 characters.",
	}),
	lastName: z.string().min(2, {
		message: "Last Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Invalid email address.",
	}),
	password: z.string()
		.min(8, {
			message: "Password must be at least 8 characters.",
		})
		.max(50, {
			message: "Password must be at most 50 characters.",
		})
		.regex(/[!@#$%^&*]/, {
			message: "Password must contain at least one special character.",
		})
		.regex(/\d/, {
			message: "Password must contain at least one digit.",
		})
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter.",
		})
})

interface StepsProps {

}

export const FirstStep: React.FC<StepsProps> = ({  }) => {
	const [password, setPassword] = useState("");
	const router = useRouter();

	const registerForm = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		fetch('/api/users/createUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		})
		.then(async (response) => {
			if (response.status === 200) {
				const encryptedUserId = await response.json()
				router.push('/register?step=2&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	function passwordStrength(password: string) {
		let strengh = 0;

		if (password === "") {
			return 0;
		}
		if (/[!@#$%^&*]/.test(password)) {
			strengh += 1;
		}
		if (/\d/.test(password)) {
			strengh += 1;
		}
		if (password.length >= 8) {
			strengh += 1;
		}
		if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
			strengh += 1;
		}
		return strengh;
	}

	return (
		<>
			<h2 className='font-medium text-3xl'>Create free account</h2>
			<div className='flex flex-col items-center w-2/3 mt-[5vh] z-20'>
				<Form {...registerForm}>
					<form onSubmit={registerForm.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
						<FormField
							control={registerForm.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											id="email"
											type="email"
											placeholder="m@example.com"
											required
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={registerForm.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											id="firstName"
											type="text"
											placeholder="John"
											required
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={registerForm.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input
											id="lastName"
											type="text"
											placeholder="Doe"
											required
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={registerForm.control}
							name="password"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>Password</FormLabel>
									<FormControl>
										<>
											<Input
												id="password"
												type="password"
												required
												{...field}
												onChange={(e) => {
													field.onChange(e);
													setPassword(e.target.value);
												}}
											/>
											<div className="flex gap-2">
												<div className={`w-1/4 h-[1.5vh] rounded-xl ${passwordStrength(password) >= 1 ? "bg-emerald-500" : "bg-foreground/5"} border border-secondary/20`}></div>
												<div className={`w-1/4 h-[1.5vh] rounded-xl ${passwordStrength(password) >= 2 ? "bg-emerald-500" : "bg-foreground/5"} border border-secondary/20`}></div>
												<div className={`w-1/4 h-[1.5vh] rounded-xl ${passwordStrength(password) >= 3 ? "bg-emerald-500" : "bg-foreground/5"} border border-secondary/20`}></div>
												<div className={`w-1/4 h-[1.5vh] rounded-xl ${passwordStrength(password) >= 4 ? "bg-emerald-500" : "bg-foreground/5"} border border-secondary/20`}></div>
											</div>
										</>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Continue
						</Button>
						<Button className="w-full">
							Continue with Google
						</Button>
					</form>
				</Form>
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

const OtpFormSchema = z.object({
	otp: z.string()
		.length(6, {
			message: "Verification code must be 6 characters.",
		})
})

export const SecondStep: React.FC<StepsProps> = ({  }) => {
	const searchParams = useSearchParams();
	const encryptedOtp = searchParams.get('otp');
	const encryptedUserId = searchParams.get('userId');
	const cryptedKey = encryptedOtp?.split('.');
	const userId = encryptedUserId?.split('.');
	const router = useRouter();

	if (encryptedOtp !== null && encryptedOtp !== "." && encryptedUserId !== null && encryptedUserId !== ".") {
		console.log('encryptedOtp:', encryptedOtp);
		console.log('encryptedUserId:', encryptedUserId);
		fetch(`/api/otps/verifyOtpLink`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedOtp: encryptedOtp, encryptedUserId: encryptedUserId}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
		resolver: zodResolver(OtpFormSchema),
		defaultValues: {
			otp: ""
		},
	});

	function onSubmit(values: z.infer<typeof OtpFormSchema>) {
		if (userId === null || userId === undefined) {
			return;
		}
		fetch('/api/otps/verifyOtp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({...values, userId: userId[0], iv: userId[1]}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<>
			<h2 className='font-medium text-3xl'>Verification code</h2>
			<Form {...otpForm}>
				<form onSubmit={otpForm.handleSubmit(onSubmit)} className="flex flex-col w-2/3 mt-[5vh] z-20 items-center gap-6">
				<FormField
						control={otpForm.control}
						name="otp"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputOTP {...field} maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
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
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>Verify</Button>
					<p className='text-center'>Don&apos;t receive ? <Link href="#" className='underline'>Click to resend</Link></p>
				</form>
			</Form>
		</>
	)
}

export const ThirdStep: React.FC<StepsProps> = ({ }) => {
	const [question, setQuestion] = useState(1);

	return (
		<>
			<h2 className='font-medium text-3xl'>Preferences</h2>
			<p className='opacity-60'>Question {question} of 5</p>
			<div className='flex flex-col w-full mt-[5vh] z-20 items-center gap-8'>
				{
					question === 1 ? <QuestionOne /> :
					question === 2 ? <QuestionTwo /> :
					question === 3 ? <QuestionThree /> :
					question === 4 ? <QuestionFour /> :
					question === 5 ? <QuestionFive /> : null
				}
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
			<Button>Continue</Button>
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
			<Button>Continue</Button>
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
			<Button>Continue</Button>
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
			<Button>Continue</Button>
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
			<Button>Continue</Button>
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