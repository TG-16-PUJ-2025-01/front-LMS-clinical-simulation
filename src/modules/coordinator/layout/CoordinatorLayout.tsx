import PrivateLayout from "@/modules/shared/layout/PrivateLayout"

interface Props {
	children: React.ReactNode
}

export default function CoordinatorLayout({ children }: Props) {
	return (
		<PrivateLayout>
			{children}
		</PrivateLayout>
	)
}
