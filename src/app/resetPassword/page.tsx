"use client";

import React from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from "react";
import Background from '@/ui/pixelart/background';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormLabel,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link"
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordFormSchema = z.object({
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
		}),
	confirmPassword: z.string()
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
});

const ResetPassword: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ResetPasswordContent />
		</Suspense>
	)
}

const ResetPasswordContent: React.FC = () => {
	const search = useSearchParams();
	const email = search.get('email');

	return (
		!email ?
		<NoUserId />
		:
		<ResetPasswordForm email={email} />
	)
	
}

interface ResetPasswordFormProps {
	email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email }) => {
	const router = useRouter();

	const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: ""
		},
	});

	function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/resetPassword`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ encryptedEmail: email, ...values })
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/login');
			}
		})
	}
	
	return (
		<Background variant='register'>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto max-w-sm bg-[#f4f4f4bb] backdrop-blur-lg w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Reset Password</CardTitle>
					</CardHeader>
					<CardContent>
						<Form  {...resetPasswordForm}>
							<form onSubmit={resetPasswordForm.handleSubmit(onSubmit)} className="grid gap-4">
								<FormField
									control={resetPasswordForm.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													id="password"
													type="password"
													required
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={resetPasswordForm.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel>
												<div className="flex items-center">
													<Label htmlFor="password">Confirm Password</Label>
												</div>
											</FormLabel>
											<FormControl>
												<Input
													id="confirmPassword"
													type="password"
													required
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Confirm
								</Button>
							</form>
						</Form>
						<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="underline">
							Sign up
						</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</Background>
	)
}

const NoUserId: React.FC = () => {
	return (
		<Background variant='register'>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto max-w-sm bg-[#f4f4f4bb] backdrop-blur-lg w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Url Error</CardTitle>
						<CardDescription className="text-sm">Please check your email for the reset password link.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</Background>
	)
}

export default ResetPassword;