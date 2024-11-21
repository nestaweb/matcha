"use client";

import React, { useState, useEffect } from "react";
import Background from '@/ui/pixelart/background';
import Link from "next/link";
import { MoveLeft, User, MailCheck, Rocket, Settings2 } from "lucide-react";
import { FirstStep, SecondStep, ThirdStep } from "@/custom/Register/Steps";

const Register: React.FC = () => {
	const [step, setStep] = useState(1);

	useEffect(() => {
		console.log('Register page loaded');
		console.log('Step:', step);
	}, [step]);

	return (
		<Background variant='register'>
			<div className='h-[100vh] flex justify-between'>
				<div className='w-3/12 bg-[#f4f4f4bb] backdrop-blur-lg mt-[2vh] ml-[2vh] h-[96vh] rounded-2xl relative'>
					<div className='absolute bottom-4 px-8 flex items-center justify-between w-full'>
						<div className='cursor-pointer flex gap-2'><MoveLeft /> Back to home</div>
						<Link href="/login">
							<div className='cursor-pointer flex gap-2 underline'>Sign in</div>
						</Link>
					</div>
					<div className='flex flex-col gap-12  px-8 pt-6'>
						<h1 className='text-xl'>42Matcha</h1>
						<div className='flex flex-col'>
							<div className={`flex gap-4 items-center ${step === 1 ? '' : 'opacity-40'}`}>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<User size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className={`font-semibold`}>Your details</h2>
									<p className='text-sm text-foreground/60'>Provide an email and password</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className={`flex gap-4 items-center ${step === 2 ? '' : 'opacity-40'}`}>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<MailCheck size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Verify your email</h2>
									<p className='text-sm text-foreground/60'>Enter your verification code</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className={`flex gap-4 items-center ${step === 3 ? '' : 'opacity-40'}`}>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<Settings2 size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Set up your preferences</h2>
									<p className='text-sm text-foreground/60'>We would like to know you more</p>
								</div>
							</div>
							<div className='bg-foreground/20 w-[1.75px] rounded-3xl h-[4vh] ml-[19px]'></div>
							<div className={`flex gap-4 items-center ${step === 4 ? '' : 'opacity-40'}`}>
								<div className='p-2 bg-primary/80 rounded-lg border-2 border-foreground/15'>
									<Rocket size={20}/>
								</div>
								<div className='flex flex-col'>
									<h2 className='font-semibold'>Welcome to 42Matcha</h2>
									<p className='text-sm text-foreground/60'>Start matching with the world</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='w-9/12 flex justify-center'>
					<div className='flex flex-col w-1/2 mx-auto items-center mt-[13.25vh]'>
						<h2 className='text-lg text-foreground/30'>42Matcha</h2>
						{
							step === 1 ? <FirstStep setStep={setStep} step={step} />
							: 
							step === 2 ?
							<SecondStep setStep={setStep} step={step} />
							:
							<ThirdStep />
						}
					</div>
				</div>
			</div>
		</Background>
	)
}

export default Register;