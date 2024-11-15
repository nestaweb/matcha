import Image from "next/image";
import { Button } from "@/ui/button";
import { ScanFace, Fuel, MessageSquareLock, Compass, MessageCircleHeart } from "lucide-react";
import Heart from '@/ui/Heart';

interface HomeProps {
	className?: string;
}

const Hero: React.FC<HomeProps> = ({ className }) => {
	return (
		<>
			<div className={`flex flex-col w-full h-[70vh] justify-center ${className || ""}`}>
				<div className="flex flex-col justify-center items-center gap-12 w-5/12 mx-auto">
					<h1 className="text-5xl font-medium text-center">Find top-rated certified partner in your area.</h1>
					<p className="text-xl">Your heart and your head need <span className="text-destructive">42Matcha</span>.</p>
					<Button>Get Started</Button>
				</div>
			</div>
			<div className="w-5/6 h-[50vh] mx-auto flex rounded-3xl bg-destructive items-center justify-between px-12 gap-8">
				<h2 className="text-4xl text-primary font-medium w-2/6">42Matcha can help you more than you imagine.</h2>
				<Image
					src="/images/match.png"
					alt="Hero"
					className="w-2/6"
					width={500}
					height={500}
				/>
				<div className="w-2/6 flex flex-col gap-6 text-primary">
					<div className="flex gap-4 items-center">
						<ScanFace size={30}/>
						<p className="font-medium text-lg">Every profile are certified</p>
					</div>
					<div className="flex gap-4 items-center">
						<Fuel size={30}/>
						<p className="font-medium text-lg">While using the app, we full your car tank</p>
					</div>
					<div className="flex gap-4 items-center">
						<MessageSquareLock size={30}/>
						<p className="font-medium text-lg">We work every day to give you the safer chat possible</p>
					</div>
				</div>
			</div>
			<h2 className="text-4xl my-[30vh] font-medium mx-auto w-1/2 text-center">Love is a world language and <span className="text-destructive">42Matcha</span> is the translator. This next genaration dating app will change your bank balance.</h2>
			<div className="flex flex-col px-16 h-[45vh] justify-center bg-destructive text-primary gap-8 rounded-tr-2xl rounded-br-2xl  w-1/2 mr-auto">
				<div className="flex items-center gap-4 text-primary">
					<Compass size={30} />
					<h2 className="text-3xl font-medium">Find the partner you need.</h2>
				</div>
				<p className="text-xl">With our complete tool, 42Matcha will show you a selection of people that should be stick to your needed. The selection is based on the age, the sexual orientation, the gender, the location and many more.</p>
			</div>
			<div className="flex w-full items-center my-[10vh] justify-center">
				<Heart className="w-[20vw] h-[27.5vh]" />
			</div>
			<div className="flex flex-col px-16 h-[45vh] justify-center bg-destructive text-primary gap-8 rounded-tl-2xl rounded-bl-2xl  w-1/2 ml-auto">
				<div className="flex items-center gap-4 text-primary">
					<MessageCircleHeart size={30} />
					<h2 className="text-3xl font-medium">Chat like in real life</h2>
				</div>
				<p className="text-xl">With our bot detection, you can be sure that you are talking with real people. Now nothing can stop you to start chatting with batman and get married with him. If you keep the secret, we wont tell anyone.</p>
			</div>
			<div className="my-[20vh] flex flex-col w-full items-center gap-8">
				<h2 className="text-4xl font-medium text-center">Ready to find <span className="text-destructive">the one</span> ?</h2>
				<Button>Get Started</Button>
			</div>
		</>
	)
}

export default Hero;