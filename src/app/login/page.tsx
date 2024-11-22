'use client';

import Background from '@/ui/pixelart/background';
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
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
	email: z.string().email({
		message: "Invalid email address.",
	}),
	password: z.string()
		.min(8, {
			message: "Password must be at least 8 characters.",
		})
});

const Login: React.FC = () => {
	const router = useRouter();
	const loginForm = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof loginFormSchema>) {
		fetch('/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		})
		.then((response) => {
			if (response.status === 200) {
				router.push('/user/me');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<Background>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto max-w-sm bg-[#f4f4f4bb] backdrop-blur-lg w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
						Enter your email below to login to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form  {...loginForm}>
							<form onSubmit={loginForm.handleSubmit(onSubmit)} className="grid gap-4">
								<FormField
									control={loginForm.control}
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
								<FormField
									control={loginForm.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel>
												<div className="flex items-center">
													<Label htmlFor="password">Password</Label>
													<Link href="/passwordReset" className="ml-auto inline-block text-sm underline">
														Forgot your password?
													</Link>
												</div>
											</FormLabel>
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
								<Button type="submit" className="w-full">
									Login
								</Button>
								<Button className="w-full">
									Login with Google
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

export default Login;