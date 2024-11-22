"use client";

import { useEffect, useState } from "react";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import * as RadioGroup from "@radix-ui/react-radio-group";

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

	useEffect(() => {
		if (encryptedUserId === null || encryptedUserId === ".") {
			router.push('/register');
		}

		fetch(`/api/users/getUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId}),
		})
		.then(async (response) => {
			if (response.status !== 200) {
				router.push('/register');
			}
		})

		fetch(`/api/users/getUserStatus`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId}),
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				if (data === true) {
					console.log('User already verified');
					router.push('/register?step=3&userId=' + encryptedUserId);
				}
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	})

	if (encryptedOtp !== null && encryptedOtp !== "." && encryptedUserId !== null && encryptedUserId !== ".") {
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

	function resendOtp() {
		if (userId === null || userId === undefined) {
			return;
		}
		fetch('/api/otps/resendOtp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: userId[0], iv: userId[1]}),
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
					<p className='text-center'>Don&apos;t receive ? <span onClick={() => {resendOtp()}} className='underline cursor-pointer'>Click to resend</span></p>
				</form>
			</Form>
		</>
	)
}

export const ThirdStep: React.FC<StepsProps> = ({ }) => {
	const searchParams = useSearchParams();
	const question = parseInt(searchParams.get('question') || '1');
	const encryptedUserId = searchParams.get('userId');
	const router = useRouter();

	useEffect(() => {
		fetch(`/api/users/getUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId}),
		})
		.then(async (response) => {
			if (response.status !== 200) {
				router.push('/register');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		fetch(`/api/users/getUserStatus`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId}),
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				if (data === false) {
					router.push('/register?step=2&userId=' + encryptedUserId);
				}
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	})

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

const genderFormSchema = z.object({
	gender: z.string()
})

export const QuestionOne: React.FC = () => {
	const genderForm = useForm<z.infer<typeof genderFormSchema>>({
		resolver: zodResolver(genderFormSchema),
		defaultValues: {
			gender: ""
		},
	});

	const searchParams = useSearchParams();
	const encryptedUserId = searchParams.get('userId');
	const router = useRouter();

	function onSubmit(values: z.infer<typeof genderFormSchema>) {
		fetch(`/api/users/setUserGender`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId, ...values}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&question=2&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your gender ?</h2>
			<Form {...genderForm}>
				<form onSubmit={genderForm.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
					<FormField
						control={genderForm.control}
						name="gender"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<RadioGroup.Root defaultValue="dontwanttosay" className='flex gap-6' onChange={(e) => field.onChange(e)} name={field.name}>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="notsure" id="r1"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Not sure about it</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="male" id="r2"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Male</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="nonbinary" id="r3"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Non binary</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="female" id="r4"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Female</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="dontwanttosay" id="r5"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Don&apos;t want to say</p>
										</div>
									</RadioGroup.Root>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>Continue</Button>
				</form>
			</Form>
		</>
	)
}

const soFormSchema = z.object({
	sexualOrientation: z.string()
})

export const QuestionTwo: React.FC = () => {
	const soForm = useForm<z.infer<typeof soFormSchema>>({
		resolver: zodResolver(soFormSchema),
		defaultValues: {
			sexualOrientation: ""
		},
	});

	const searchParams = useSearchParams();
	const encryptedUserId = searchParams.get('userId');
	const router = useRouter();

	function onSubmit(values: z.infer<typeof soFormSchema>) {
		fetch(`/api/users/setUserSexualOrientation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId, ...values}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&question=3&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your sexual orientation ?</h2>
			<Form {...soForm}>
				<form onSubmit={soForm.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
					<FormField
						control={soForm.control}
						name="sexualOrientation"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<RadioGroup.Root defaultValue="heterosexual" className='flex gap-6' onChange={(e) => field.onChange(e)} name={field.name}>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="heterosexual" id="r1"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Heterosexual</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="homosexual" id="r2"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Homosexual</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="bisexual" id="r3"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Bisexual</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="asexual" id="r4"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Asexual</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="dontwanttosay" id="r5"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Don&apos;t want to say</p>
										</div>
									</RadioGroup.Root>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>Continue</Button>
				</form>
			</Form>
		</>
	)
}

const ageFormSchema = z.object({
	age: z.string()
})

export const QuestionThree: React.FC = () => {

	const ageForm = useForm<z.infer<typeof ageFormSchema>>({
		resolver: zodResolver(ageFormSchema),
		defaultValues: {
			age: ""
		},
	});

	const searchParams = useSearchParams();
	const encryptedUserId = searchParams.get('userId');
	const router = useRouter();

	function onSubmit(values: z.infer<typeof ageFormSchema>) {
		fetch(`/api/users/setUserAge`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId, ...values}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&question=4&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const [value, setValue] = useState(18);
	const handleChange = (val: number[]) => {
		setValue(val[0]);
	};
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What&apos;s your age ?</h2>
			<Form {...ageForm}>
				<form onSubmit={ageForm.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
					<FormField
						control={ageForm.control}
						name="age"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<>
										<Slider
											min={18}
											max={90}
											value={[value]}
											name={field.name}
											onValueChange={(e) => {handleChange(e)}}
											onChange={(e) => {field.onChange(e)}}
										/>
										<p>selected age : {value}</p>
									</>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>Continue</Button>
				</form>
			</Form>
		</>
	)
}

const goalFormSchema = z.object({
	goal: z.string()
})

export const QuestionFour: React.FC = () => {
	const goalForm = useForm<z.infer<typeof goalFormSchema>>({
		resolver: zodResolver(goalFormSchema),
		defaultValues: {
			goal: ""
		},
	});

	const searchParams = useSearchParams();
	const encryptedUserId = searchParams.get('userId');
	const router = useRouter();

	function onSubmit(values: z.infer<typeof goalFormSchema>) {
		fetch(`/api/users/setUserGoal`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId, ...values}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/register?step=3&question=5&userId=' + encryptedUserId);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}
	return (
		<>
			<h2 className='text-xl font-medium text-foreground/80'>What are you searching for ?</h2>
			<Form {...goalForm}>
				<form onSubmit={goalForm.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
					<FormField
						control={goalForm.control}
						name="goal"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<RadioGroup.Root defaultValue="date" className='flex gap-6' onChange={(e) => field.onChange(e)} name={field.name}>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="friend" id="r1"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Friend</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="date" id="r2"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Date</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="sex" id="r3"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Sex</p>
										</div>
										<div className="flex flex-col gap-2 items-center">
											<RadioGroup.Item value="serious" id="r5"  className='w-14 h-14 rounded-full border-2 border-foreground/15 flex items-center justify-center'>
												<RadioGroup.Indicator className='w-11 h-11 bg-foreground/80 rounded-full'/>
											</RadioGroup.Item>
											<p className='text-foreground/60 text-center'>Serious</p>
										</div>
									</RadioGroup.Root>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>Continue</Button>
				</form>
			</Form>
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