import Background from '@/ui/pixelart/background';
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

const PasswordChange: React.FC = () => {
	return (
		<Background>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto max-w-sm bg-[#f4f4f4bb] backdrop-blur-lg w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Change Password</CardTitle>
						<CardDescription>
							Enter your new password below
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input id="password" type="password" required />
							<div className="flex gap-2">
								<div className='w-1/4 h-[1.5vh] rounded-xl bg-emerald-500 border border-secondary/20'></div>
								<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
								<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
								<div className='w-1/4 h-[1.5vh] rounded-xl bg-foreground/5 border border-secondary/20'></div>
							</div>
						</div>
						<Button type="submit" className="w-full">
							Change
						</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</Background>
	)
}

export default PasswordChange;