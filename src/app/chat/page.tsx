import Background from "@/ui/pixelart/background";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Ellipsis, Eye, Ban, MessageCircleOff, Image as ImageIcon, Phone, Video } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/ui/input";

const ChatHome: React.FC = () => {
	return (
		<Background variant='userProfile'>
			<div className="flex h-[80vh] max-h-[80vh] w-[80vw] max-w-[80vw] border-2 border-foreground/5 bg-[#f4f4f4bb] mx-auto my-[10vh] rounded-xl backdrop-blur overflow-hidden">
				<div className="w-2/6 h-full border-r-2 p-8 py-6 bg-foreground/5 flex flex-col gap-8">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-semibold">Chat <span className="text-foreground/50">(2)</span></h1>
						<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
							<Ellipsis />
						</div>
					</div>
					<ScrollArea className="flex flex-col gap-4 h-8/12 overflow-x-scroll">
						<div className="flex gap-4 items-center bg-foreground/10 p-4 rounded-lg cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">Jane Doe</p>
								<p className="text-foreground/60">Hey dan !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">Elizabeth Smith</p>
								<p className="text-foreground font-medium">No sorry I wont be there ...</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/fdd/man-avatar-1632964.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Doe</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
						<div className="flex gap-4 items-center hover:bg-foreground/10 p-4 rounded-lg transition duration-200 ease-in-out cursor-pointer">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-lg font-medium">John Smith</p>
								<p className="text-foreground/60">Do the first step !</p>
							</div>
						</div>
					</ScrollArea>
				</div>
				<div className="w-4/6 h-full flex flex-col">
					<div className="h-1/12 p-8 py-5 bg-foreground/5 border-b-2 flex justify-between items-center">
						<div className="flex items-center gap-4">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<p className="text-lg font-medium">Jane Doe</p>
						</div>
						<div className="flex gap-8 items-center w-1/2 justify-end">
							<div className="flex items-center gap-2">
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Video className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Phone className="text-foreground/80" size={22} />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Ban className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<MessageCircleOff className="text-foreground/80" size={22} />
								</div>
								<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
									<Eye className="text-foreground/80" size={22} />
								</div>
							</div>
						</div>
					</div>
					<ScrollArea className="flex flex-col-reverse p-8 h-9/12 overflow-y-auto">
						<div className="w-full flex flex-col gap-4">
							<div className="flex items-end gap-2 w-2/3">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/10 p-4 rounded-2xl rounded-bl-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-foreground/60">14:36</p>
								</div>
							</div>
							<div className="flex items-end flex-row-reverse gap-2 w-2/3 ml-auto">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/90 text-primary p-4 rounded-2xl rounded-br-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-primary/60">14:36</p>
								</div>
							</div>
							<div className="flex items-end gap-2 w-2/3">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/10 p-4 rounded-2xl rounded-bl-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-foreground/60">14:36</p>
								</div>
							</div>
							<div className="flex items-end flex-row-reverse gap-2 w-2/3 ml-auto">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/90 text-primary p-4 rounded-2xl rounded-br-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-primary/60">14:36</p>
								</div>
							</div>
							<div className="flex items-end gap-2 w-2/3">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/10 p-4 rounded-2xl rounded-bl-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-foreground/60">14:36</p>
								</div>
							</div>
							<div className="flex items-end flex-row-reverse gap-2 w-2/3 ml-auto">
								<Avatar>
									<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="bg-foreground/90 text-primary p-4 rounded-2xl rounded-br-none flex flex-col gap-1">
									<p>
										This is the message I wanted to send you but then i rememebered that i had to do something else.
									</p>
									<p className="w-full flex justify-end text-sm text-primary/60">14:36</p>
								</div>
							</div>
						</div>
					</ScrollArea>
					<div className="flex p-8 py-5 gap-4">
						<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
							<ImageIcon />
						</div>
						<Input className="transition duration-300 ease-in-out py-5 px-4 rounded-2xl border-foreground/10 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/70" placeholder="Type a message ..." />
					</div>
				</div>
			</div>
		</Background>
	)
}

export default ChatHome;