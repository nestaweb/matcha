interface HeartProps {
	className?: string;
}

const Heart: React.FC<HeartProps> = ({ className }) => {
	return (
		<div className={`grid grid-cols-11 grid-rows-9 ${className || "w-[50vw] h-[50vh]"}`}>
			<div className="bg-foreground col-start-3"></div>
			<div className="bg-foreground"></div>
			<div className="bg-foreground row-start-2 col-start-5"></div>
			<div className="bg-foreground row-start-3 col-start-6"></div>
			<div className="bg-foreground row-start-2 col-start-7"></div>
			<div className="bg-foreground col-start-8"></div>
			<div className="bg-foreground col-start-9"></div>
			<div className="bg-foreground col-start-2"></div>
			<div className="bg-foreground col-start-1 row-start-3"></div>
			<div className="bg-foreground col-start-1 row-start-4"></div>
			<div className="bg-foreground col-start-10 row-start-2"></div>
			<div className="bg-foreground col-start-11 row-start-3"></div>
			<div className="bg-foreground col-start-11 row-start-4"></div>
			<div className="bg-foreground col-start-2 row-start-5"></div>
			<div className="bg-foreground col-start-10 row-start-5"></div>
			<div className="bg-foreground col-start-3 row-start-6"></div>
			<div className="bg-foreground col-start-9 row-start-6"></div>
			<div className="bg-foreground col-start-8 row-start-7"></div>
			<div className="bg-foreground col-start-4 row-start-7"></div>
			<div className="bg-foreground col-start-7 row-start-8"></div>
			<div className="bg-foreground col-start-5 row-start-8"></div>
			<div className="bg-foreground col-start-6 row-start-9"></div>
			{/* Heart fill */}
			<div className="bg-destructive col-start-3 row-start-2"></div>
			<div className="bg-destructive col-start-4 row-start-2"></div>
			<div className="bg-destructive col-start-8 row-start-2"></div>
			<div className="bg-destructive col-start-9 row-start-2"></div>
			<div className="bg-destructive col-start-2 row-start-3"></div>
			<div className="bg-destructive col-start-3 row-start-3"></div>
			<div className="bg-destructive col-start-4 row-start-3"></div>
			<div className="bg-destructive col-start-5 row-start-3"></div>
			<div className="bg-destructive col-start-7 row-start-3"></div>
			<div className="bg-destructive col-start-8 row-start-3"></div>
			<div className="bg-destructive col-start-9 row-start-3"></div>
			<div className="bg-destructive col-start-10 row-start-3"></div>
			<div className="bg-destructive col-start-2 row-start-4"></div>
			<div className="bg-destructive col-start-3 row-start-4"></div>
			<div className="bg-destructive col-start-4 row-start-4"></div>
			<div className="bg-destructive col-start-5 row-start-4"></div>
			<div className="bg-destructive col-start-6 row-start-4"></div>
			<div className="bg-destructive col-start-7 row-start-4"></div>
			<div className="bg-destructive col-start-8 row-start-4"></div>
			<div className="bg-destructive col-start-9 row-start-4"></div>
			<div className="bg-destructive col-start-10 row-start-4"></div>
			<div className="bg-destructive col-start-3 row-start-5"></div>
			<div className="bg-destructive col-start-4 row-start-5"></div>
			<div className="bg-destructive col-start-5 row-start-5"></div>
			<div className="bg-destructive col-start-6 row-start-5"></div>
			<div className="bg-destructive col-start-7 row-start-5"></div>
			<div className="bg-destructive col-start-8 row-start-5"></div>
			<div className="bg-destructive col-start-9 row-start-5"></div>
			<div className="bg-destructive col-start-4 row-start-6"></div>
			<div className="bg-destructive col-start-5 row-start-6"></div>
			<div className="bg-destructive col-start-6 row-start-6"></div>
			<div className="bg-destructive col-start-7 row-start-6"></div>
			<div className="bg-destructive col-start-8 row-start-6"></div>
			<div className="bg-destructive col-start-5 row-start-7"></div>
			<div className="bg-destructive col-start-6 row-start-7"></div>
			<div className="bg-destructive col-start-7 row-start-7"></div>
			<div className="bg-destructive col-start-6 row-start-8"></div>
		</div>
	)
}

export default Heart;