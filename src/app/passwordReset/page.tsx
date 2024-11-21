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
import { Label } from "@/components/ui/label";

const PasswordReset: React.FC = () => {
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
						<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							/>
						</div>
						<Button type="submit" className="w-full">
							Send
						</Button>
						</div>
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