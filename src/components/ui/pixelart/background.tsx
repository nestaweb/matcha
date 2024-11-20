interface BackgroundProps {
	className?: string;
	children?: React.ReactNode;
	variant?: "login" | "register" | "userProfile";
}

const Background: React.FC<BackgroundProps> = ({ className, children, variant = "login" }) => {
	return (
		<div className={`${className || ""}`}>
			<div className="relative z-10">
				{children}
			</div>
			{
				variant === "login" ?
				<LoginBackground />
				:
				variant === "register" ?
				<RegisterBackground />
				:
				variant === "userProfile" ?
				<UserProfileBackground />
				:
				null
			}
		</div>
	)
}

const UserProfileBackground: React.FC<BackgroundProps> = () => {
	return (
			<div className="absolute top-0 left-0 right-0 w-[100vw] h-[100vh] grid grid-cols-48 grid-rows-32">
				{/* Top right */}
				<div className="bg-foreground col-start-46"></div>
				<div className="bg-foreground col-start-48"></div>
				<div className="bg-foreground col-start-48"></div>
				<div className="bg-foreground col-start-47"></div>
				<div className="bg-foreground col-start-46"></div>
				<div className="bg-foreground col-start-48"></div>
				<div className="bg-foreground col-start-46"></div>
				<div className="bg-foreground col-start-46"></div>
				<div className="bg-foreground col-start-47"></div>
				<div className="bg-foreground col-start-47"></div>
				<div className="bg-foreground col-start-48"></div>
				<div className="bg-foreground col-start-45"></div>
				<div className="bg-foreground col-start-46"></div>
				<div className="bg-foreground col-start-45"></div>
				<div className="bg-foreground col-start-45"></div>
				<div className="bg-foreground col-start-44"></div>
				<div className="bg-foreground col-start-48"></div>
				<div className="bg-foreground col-start-47 row-start-8"></div>
				<div className="bg-foreground col-start-47 row-start-9"></div>
				<div className="bg-foreground col-start-47 row-start-10"></div>
				<div className="bg-foreground col-start-47 row-start-11"></div>
				<div className="bg-foreground col-start-48"></div>

				{/* Center left */}
				<div className="bg-foreground row-start-16"></div>
				<div className="bg-foreground row-start-18"></div>
				<div className="bg-foreground row-start-19"></div>
				<div className="bg-foreground col-start-3 row-start-16"></div>
				<div className="bg-foreground col-start-2 row-start-17"></div>
				<div className="bg-foreground col-start-4 row-start-18"></div>
				<div className="bg-foreground col-start-3 row-start-18"></div>
				<div className="bg-foreground col-start-5 row-start-19"></div>
				<div className="bg-foreground col-start-7 row-start-17"></div>
				<div className="bg-foreground col-start-3 row-start-19"></div>
				<div className="bg-foreground col-start-2 row-start-20"></div>
				<div className="bg-foreground col-start-2 row-start-21"></div>
				<div className="bg-foreground col-start-3 row-start-21"></div>
				<div className="bg-foreground col-start-2 row-start-22"></div>
				<div className="bg-foreground col-start-1 row-start-23"></div>
				<div className="bg-foreground col-start-8 row-start-18"></div>
			</div>
	)
}

const RegisterBackground: React.FC<BackgroundProps> = () => {
	return (
		<div className="absolute top-0 left-0 right-0 w-[100vw] h-[100vh] grid grid-cols-48 grid-rows-32">
			<div className="bg-foreground col-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-3"></div>
			<div className="bg-foreground row-start-4"></div>
			<div className="bg-foreground row-start-5"></div>
			<div className="bg-foreground row-start-5"></div>
			<div className="bg-foreground row-start-7"></div>
			<div className="bg-foreground row-start-8"></div>
			<div className="bg-foreground row-start-6 col-start-3"></div>
			<div className="bg-foreground row-start-6 col-start-4"></div>
			<div className="bg-foreground row-start-6 col-start-5"></div>
			<div className="bg-foreground row-start-5 col-start-5"></div>
			<div className="bg-foreground row-start-5 col-start-6"></div>
			<div className="bg-foreground row-start-7 col-start-4"></div>
			<div className="bg-foreground row-start-7 col-start-5"></div>
			<div className="bg-foreground row-start-8 col-start-5"></div>
			<div className="bg-foreground row-start-8 col-start-6"></div>
			<div className="bg-foreground row-start-7 col-start-7"></div>

			{/* Bottom left */}
			<div className="bg-foreground row-start-32 col-start-48"></div>
			<div className="bg-foreground row-start-32 col-start-46"></div>
			<div className="bg-foreground row-start-32 col-start-44"></div>
			<div className="bg-foreground row-start-32 col-start-42"></div>
			<div className="bg-foreground row-start-31 col-start-43"></div>
			<div className="bg-foreground row-start-30 col-start-44"></div>
			<div className="bg-foreground row-start-30 col-start-43"></div>
			<div className="bg-foreground row-start-31 col-start-42"></div>
			<div className="bg-foreground row-start-32 col-start-41"></div>
			<div className="bg-foreground row-start-31 col-start-40"></div>
			<div className="bg-foreground row-start-29 col-start-46"></div>
			<div className="bg-foreground row-start-31 col-start-47"></div>
			<div className="bg-foreground row-start-30 col-start-46"></div>
			<div className="bg-foreground row-start-29 col-start-45"></div>
			<div className="bg-foreground row-start-28 col-start-44"></div>
			<div className="bg-foreground row-start-28 col-start-44"></div>

		</div>
	)
}

const LoginBackground: React.FC<BackgroundProps> = () => {
	return (
		<div className="absolute top-0 left-0 right-0 w-[100vw] h-[100vh] grid grid-cols-48 grid-rows-32">
			<div className="bg-foreground col-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-2"></div>
			<div className="bg-foreground row-start-3"></div>
			<div className="bg-foreground row-start-4"></div>
			<div className="bg-foreground row-start-5"></div>
			<div className="bg-foreground row-start-5"></div>
			<div className="bg-foreground row-start-7"></div>
			<div className="bg-foreground row-start-8"></div>
			<div className="bg-foreground row-start-6 col-start-3"></div>
			<div className="bg-foreground row-start-6 col-start-4"></div>
			<div className="bg-foreground row-start-6 col-start-5"></div>
			<div className="bg-foreground row-start-5 col-start-5"></div>
			<div className="bg-foreground row-start-5 col-start-6"></div>
			<div className="bg-foreground row-start-7 col-start-4"></div>
			<div className="bg-foreground row-start-7 col-start-5"></div>
			<div className="bg-foreground row-start-8 col-start-5"></div>
			<div className="bg-foreground row-start-8 col-start-6"></div>
			<div className="bg-foreground row-start-7 col-start-7"></div>
			{/* Right */}
			<div className="bg-foreground row-start-7 col-start-48"></div>
			<div className="bg-foreground row-start-7 col-start-46"></div>
			<div className="bg-foreground row-start-7 col-start-44"></div>
			<div className="bg-foreground row-start-7 col-start-42"></div>
			<div className="bg-foreground row-start-8 col-start-47"></div>
			<div className="bg-foreground row-start-8 col-start-45"></div>
			<div className="bg-foreground row-start-8 col-start-44"></div>
			<div className="bg-foreground row-start-9 col-start-48"></div>
			<div className="bg-foreground row-start-9 col-start-47"></div>
			<div className="bg-foreground row-start-9 col-start-46"></div>
			<div className="bg-foreground row-start-9 col-start-45"></div>
			<div className="bg-foreground row-start-9 col-start-44"></div>
			<div className="bg-foreground row-start-9 col-start-43"></div>
			<div className="bg-foreground row-start-9 col-start-42"></div>
			<div className="bg-foreground row-start-9 col-start-34"></div>
			<div className="bg-foreground row-start-10 col-start-48"></div>
			<div className="bg-foreground row-start-10 col-start-47"></div>
			<div className="bg-foreground row-start-10 col-start-46"></div>
			<div className="bg-foreground row-start-10 col-start-45"></div>
			<div className="bg-foreground row-start-10 col-start-44"></div>
			<div className="bg-foreground row-start-10 col-start-43"></div>
			<div className="bg-foreground row-start-10 col-start-38"></div>
			<div className="bg-foreground row-start-10 col-start-37"></div>
			<div className="bg-foreground row-start-10 col-start-35"></div>
			<div className="bg-foreground row-start-10 col-start-33"></div>
			<div className="bg-foreground row-start-11 col-start-48"></div>
			<div className="bg-foreground row-start-11 col-start-47"></div>
			<div className="bg-foreground row-start-11 col-start-43"></div>
			<div className="bg-foreground row-start-11 col-start-42"></div>

			{/* Bottom */}
			<div className="bg-foreground row-start-31 col-start-16"></div>
			<div className="bg-foreground row-start-31 col-start-17"></div>
			<div className="bg-foreground row-start-31 col-start-19"></div>
			<div className="bg-foreground row-start-31 col-start-20"></div>
			<div className="bg-foreground row-start-31 col-start-21"></div>
			<div className="bg-foreground row-start-31 col-start-22"></div>
			<div className="bg-foreground row-start-31 col-start-23"></div>

			<div className="bg-foreground row-start-30 col-start-16"></div>
			<div className="bg-foreground row-start-30 col-start-22"></div>

			<div className="bg-foreground row-start-29 col-start-16"></div>
			<div className="bg-foreground row-start-29 col-start-17"></div>
			<div className="bg-foreground row-start-29 col-start-18"></div>
			<div className="bg-foreground row-start-29 col-start-19"></div>
			<div className="bg-foreground row-start-29 col-start-22"></div>
			<div className="bg-foreground row-start-29 col-start-23"></div>

			<div className="bg-foreground row-start-28 col-start-17"></div>
			<div className="bg-foreground row-start-28 col-start-18"></div>
			<div className="bg-foreground row-start-28 col-start-20"></div>
			<div className="bg-foreground row-start-28 col-start-21"></div>
			<div className="bg-foreground row-start-28 col-start-22"></div>
			<div className="bg-foreground row-start-28 col-start-23"></div>

			<div className="bg-foreground row-start-27 col-start-17"></div>
			<div className="bg-foreground row-start-27 col-start-18"></div>
			<div className="bg-foreground row-start-27 col-start-21"></div>
			<div className="bg-foreground row-start-27 col-start-23"></div>

			<div className="bg-foreground row-start-26 col-start-16"></div>
			<div className="bg-foreground row-start-26 col-start-18"></div>
			<div className="bg-foreground row-start-26 col-start-19"></div>
			<div className="bg-foreground row-start-26 col-start-21"></div>
			<div className="bg-foreground row-start-26 col-start-22"></div>

			<div className="bg-foreground row-start-25 col-start-17"></div>
			<div className="bg-foreground row-start-25 col-start-18"></div>
			<div className="bg-foreground row-start-25 col-start-19"></div>
			<div className="bg-foreground row-start-25 col-start-20"></div>
			<div className="bg-foreground row-start-25 col-start-21"></div>
			<div className="bg-foreground row-start-25 col-start-23"></div>

			<div className="bg-foreground row-start-24 col-start-17"></div>
			<div className="bg-foreground row-start-24 col-start-18"></div>
			<div className="bg-foreground row-start-24 col-start-19"></div>
			<div className="bg-foreground row-start-24 col-start-21"></div>
			<div className="bg-foreground row-start-24 col-start-22"></div>
			<div className="bg-foreground row-start-24 col-start-23"></div>

			{/* 4 */}
			<div className="bg-foreground row-start-2 col-start-16"></div>
			<div className="bg-foreground row-start-3 col-start-16"></div>
			<div className="bg-foreground row-start-4 col-start-16"></div>
			<div className="bg-foreground row-start-5 col-start-16"></div>
			<div className="bg-foreground row-start-5 col-start-17"></div>
			<div className="bg-foreground row-start-5 col-start-18"></div>
			<div className="bg-foreground row-start-5 col-start-19"></div>
			<div className="bg-foreground row-start-5 col-start-20"></div>
			<div className="bg-foreground row-start-2 col-start-19"></div>
			<div className="bg-foreground row-start-3 col-start-19"></div>
			<div className="bg-foreground row-start-4 col-start-19"></div>
			<div className="bg-foreground row-start-5 col-start-19"></div>
			<div className="bg-foreground row-start-6 col-start-19"></div>
			<div className="bg-foreground row-start-7 col-start-19"></div>
			<div className="bg-foreground row-start-8 col-start-19"></div>

			{/* 2 */}
			<div className="bg-foreground row-start-3 col-start-23"></div>
			<div className="bg-foreground row-start-2 col-start-24"></div>
			<div className="bg-foreground row-start-2 col-start-25"></div>
			<div className="bg-foreground row-start-2 col-start-26"></div>
			<div className="bg-foreground row-start-3 col-start-27"></div>
			<div className="bg-foreground row-start-4 col-start-27"></div>
			<div className="bg-foreground row-start-5 col-start-26"></div>
			<div className="bg-foreground row-start-6 col-start-25"></div>
			<div className="bg-foreground row-start-7 col-start-24"></div>
			<div className="bg-foreground row-start-8 col-start-23"></div>
			<div className="bg-foreground row-start-8 col-start-24"></div>
			<div className="bg-foreground row-start-8 col-start-25"></div>
			<div className="bg-foreground row-start-8 col-start-26"></div>
			<div className="bg-foreground row-start-8 col-start-27"></div>
		</div>
	)
}

export default Background;