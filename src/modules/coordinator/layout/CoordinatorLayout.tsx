import { Toaster } from "@/modules/core/components/ui/sonner"

interface Props {
	children: React.ReactNode
}

export default function CoordinatorLayout({ children }: Props) {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto p-4">{children}</div>
			<Toaster />
		</div>
	)
}
