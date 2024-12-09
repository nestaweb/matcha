'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot
} from "@/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/ui/button";
import Background from "@/ui/pixelart/background";

const OtpFormSchema = z.object({
	otp: z.string()
		.length(6, {
			message: "Verification code must be 6 characters.",
		})
})

const VerifyEmailContent: React.FC = () => {
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

		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: encryptedUserId}),
		})
		.then(async (response) => {
			if (response.status !== 200) {
				router.push('/login');
			}
		})

		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUserStatus`, {
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
					router.push('/login');
				}
			}
		})
		.catch((error) => {
			// console.error('Error:', error);
		});
	})

	if (encryptedOtp !== null && encryptedOtp !== "." && encryptedUserId !== null && encryptedUserId !== ".") {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/otps/verifyOtpLink`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedOtp: encryptedOtp, encryptedUserId: encryptedUserId}),
		})
		.then((response) => {
			if (response.status === 200) {
				alert('Email verified');
				router.push('/login');
			}
		})
		.catch((error) => {
			// console.error('Error:', error);
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
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/otps/verifyOtp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({...values, userId: userId[0], iv: userId[1]}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/login');
			}
		})
		.catch((error) => {
			// console.error('Error:', error);
		});
	}

	function resendOtp() {
		if (userId === null || userId === undefined) {
			return;
		}
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/otps/resendOtp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({encryptedUserId: userId[0], iv: userId[1]}),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/login');
			}
		})
		.catch((error) => {
			// console.error('Error:', error);
		});
	}

	return (
		<Background variant='register'>
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
		</Background>
	)
}

export default VerifyEmailContent;