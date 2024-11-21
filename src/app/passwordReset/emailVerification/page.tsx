"use client";
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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const EmailVerification: React.FC = () => {
	return (
		<Background variant='register'>
			<div className='fixed bottom-8 left-12 cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
			<div className='h-[100vh] flex items-center'>
				<Card className="mx-auto bg-[#f4f4f4bb] backdrop-blur-lg max-w-lg">
					<CardHeader>
						<CardTitle className="text-2xl">Email Verification</CardTitle>
						<CardDescription>
							Please enter the 6-digit code sent to your email address
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4">
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
							<Button type="submit" className="w-full">
								Verify
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</Background>
	)
}

export default EmailVerification;