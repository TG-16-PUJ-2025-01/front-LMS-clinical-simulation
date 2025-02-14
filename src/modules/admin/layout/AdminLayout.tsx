interface Props {
	children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
	return (
		<div className="bg-gray-100 min-h-screen">
			{/* Header goes here */}
			<div className="mx-auto max-w-[1200px]">{children}</div>
		</div>
	)
}
