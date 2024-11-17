import { Button } from "@/ui/button";
import Link from "next/link";

interface NavBarProps {
	className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
	return (
		<div className={`fixed backdrop-blur-lg border-b top-0 left-0 right-0 w-[100vw] py-4 px-12 flex items-center justify-between ${className || ""}`}>
			<p className="text-xl font-medium">42Matcha</p>
			<Link href={"/login"}>
				<Button>Login</Button>
			</Link>
		</div>
	)
}

export default NavBar;