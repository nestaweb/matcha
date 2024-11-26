"use client";

import Background from '@/ui/pixelart/background';
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const emailFormSchema = z.object({
	email: z.string().email({
		message: "Invalid email address.",
	}),
});

const PasswordReset: React.FC = () => {

	const emailForm = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof emailFormSchema>) {
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/sendResetPasswordLink`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		})
		.then((response) => {
			if (response.status === 200) {
				alert('Password reset link sent successfully');
			}
		})
	}

	return (
		<Background variant='register'>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto max-w-sm bg-[#f4f4f4bb] backdrop-blur-lg w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Password Reset</CardTitle>
						<CardDescription>Send a password reset link to your email address.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...emailForm}>
							<form className="grid gap-4" onSubmit={emailForm.handleSubmit(onSubmit)}>
								<div className="grid gap-2">
								<FormField
									control={emailForm.control}
									name="email"
									render={({ field }) => (
										<FormItem className="grid gap-2">
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
								</div>
								<Button type="submit" className="w-full">
									Send
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

export default PasswordReset;