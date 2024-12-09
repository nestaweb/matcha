'use client';

import { Suspense } from "react";
import VerifyEmailContent from "@/custom/verifyEmail/verifyEmail";

const VerifyEmail: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className='w-full flex justify-center'>
				<div className='flex flex-col w-1/2 mx-auto items-center mt-[13.25vh]'>
					<VerifyEmailContent />
				</div>
			</div>
		</Suspense>
	)
}

export default VerifyEmail;