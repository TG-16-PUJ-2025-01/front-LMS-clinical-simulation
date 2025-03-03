import { Toaster } from "@/modules/core/components/ui/sonner"
import { useLayoutSlots } from "@/modules/core/hooks/useLayoutSlots"

interface Props {
	children: React.ReactNode
}

export default function PrivateLayout({ children }: Props) {
  const { slots } = useLayoutSlots()

  return (
    <div className="min-h-screen bg-gray-100">
			{slots.header}
			<main className="container mx-auto flex flex-col items-center gap-4 p-4">
				<h1 className="w-full text-2xl font-semibold">{slots.title}</h1>
				<section className="flex h-full w-full flex-col justify-between rounded-2xl bg-white px-4 shadow-md">
					{children}
				</section>
			</main>
			<Toaster />
		</div>
  )
}