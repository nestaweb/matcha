import NavBar from '@/custom/NavBar/NavBar';
import Background from '@/ui/pixelart/background';
import { Button } from '@/ui/button';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { Input } from '@/ui/input';
import { Textarea } from "@/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const EditUser: React.FC = () => {
	return (
		<Background variant='userProfile'>
			<NavBar/>
			<div className='flex justify-between gap-16 p-4 mt-[10vh]'>
				<div className='flex flex-col gap-8 bg-[#f4f4f4bb] backdrop-blur rounded-2xl w-2/6 p-6 border-2 border-foreground/5 max-h-[84vh] overflow-x-scroll'>
					<div className='flex gap-8 items-start justify-between'>
						<div className='flex flex-col gap-3'>
							<div className='flex gap-3 w-2/3'>
								<Input className='text-4xl py-3 md:text-2xl' defaultValue={"Nesta"} />
							</div>
							<div className='flex items-center gap-2 px-1 w-fit'>
								<div className='w-3 h-3 bg-teal-400/30 flex items-center justify-center'>
									<div className='w-1.5 h-1.5 bg-teal-400'></div>
								</div>
								<p>Paris</p>
							</div>
						</div>
						<div className='text-lg whitespace-nowrap'>27 <span className='text-sm text-foreground/60'>relations</span></div>
					</div>
					<div className='grid grid-cols-2 gap-2 gap-y-3'>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Age</p>
							<p>//</p>
						</div>
						<div className='col-start-2 flex justify-end'>
							<Input type='number' className='text-right' defaultValue={19} />
						</div>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Height</p>
							<p>//</p>
						</div>
						<div className='col-start-2 flex justify-end items-center'>
							<Input type='number' className='text-right' defaultValue={184} />
						</div>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Sexual Orientation</p>
							<p>//</p>
						</div>
						<div className='col-start-2 flex justify-end'>
							<Select defaultValue='hetero'>
								<SelectTrigger className="text-right">
									<SelectValue placeholder="" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="homo">Homosexual</SelectItem>
									<SelectItem value="hetero">Heterosexual</SelectItem>
									<SelectItem value="bi">Bisexual</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center w-full justify-between col-start-1 font-medium'>
							<p>Searching for</p>
							<p>//</p>
						</div>
						<div className='col-start-2 flex justify-end'>
						<Select defaultValue='friends'>
								<SelectTrigger className="text-right">
									<SelectValue placeholder="" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="friends">Friends</SelectItem>
									<SelectItem value="date">Date</SelectItem>
									<SelectItem value="sex">Sex</SelectItem>
									<SelectItem value="love">Love</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='flex flex-col gap-2 mt-2'>
						<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
							<p>Interests</p>
							<p>//</p>
						</div>
						<div className='flex flex-wrap gap-2'>
							<div className='bg-foreground/90 text-primary px-4 py-1 rounded-3xl cursor-default relative'>
								<p className='flex items-center gap-1'><span className='text-primary/70'>#</span>Bouldering</p>
								<div className='absolute -top-2 -right-2 border-2 border-foreground bg-primary/90 p-1 rounded-full text-foreground'><X size={15} /></div>
							</div>
							<div className='bg-foreground/90 text-primary px-4 py-1 rounded-3xl cursor-default relative'>
								<p className='flex items-center gap-1'><span className='text-primary/70'>#</span>Books</p>
								<div className='absolute -top-2 -right-2 border-2 border-foreground bg-primary/90 p-1 rounded-full text-foreground'><X size={15} /></div>
							</div>
							<div className='flex bg-foreground/70 text-primary px-4 py-1 rounded-3xl cursor-default relative items-center border-2 border-dashed border-foreground'>
								<p className='flex items-center gap-1 justify-center text-primary/90'><Plus size={15} /></p>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-2'>
						<div className='flex items-center w-1/2 justify-between pr-1 font-medium'>
							<p>Bio</p>
							<p>//</p>
						</div>
						<Textarea defaultValue={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas recusandae deleniti sint pariatur soluta cum veniam officia consectetur explicabo tenetur laborum similique nesciunt, odit labore? Beatae qui officiis temporibus omnis."} />
					</div>
					<div className='flex gap-2'>
						<Button className='w-full'>Save Profile</Button>
					</div>
				</div>
				<div className='flex items-end w-4/6 h-[84vh] gap-8'>
					<div className='flex items-center h-full w-2/5 bg-foreground/30 rounded-2xl relative'>
						<Image
							src='/images/pp0.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-cover object-center absolute top-0 left-0 rounded-2xl blur-3xl'
						/>
						<Image
							src='/images/pp0.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
						<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full'><X size={20} /></div>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp1.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
						<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full'><X size={20} /></div>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp2.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
						<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full'><X size={20} /></div>
					</div>
					<div className='flex items-center bg-foreground/30 h-2/6 rounded-2xl relative flex-1'>
						<Image
							src='/images/pp3.jpg'
							width={450}
							height={400}
							alt='profile picture'
							className='w-full h-full object-contain object-center z-10'
						/>
						<div className='absolute -top-2 -right-2 bg-foreground/90 text-primary p-1 rounded-full'><X size={20} /></div>
					</div>
					<div className='flex flex-col items-center justify-center bg-foreground/70 h-2/6 rounded-2xl relative flex-1 border-4 border-foreground border-dashed text-primary/70'>
						<Plus size={30} />
					</div>
				</div>
			</div>
		</Background>
	)
}

export default EditUser;