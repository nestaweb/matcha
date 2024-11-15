interface FooterProps {
	className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
	return (
		<div className={`border-t w-[100vw] py-4 px-12 flex items-center justify-between ${className || ""}`}>
			<p className="text-xl font-medium">42Matcha</p>
		</div>
	)
}

export default Footer;