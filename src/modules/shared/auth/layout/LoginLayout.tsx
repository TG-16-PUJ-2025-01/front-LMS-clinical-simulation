import { cn } from "@/modules/core/lib/utils";
import AuthFlow from "@/modules/shared/auth/components/AuthFlow";

export default function LoginLayout({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex min-h-screen", className)} {...props}>
			<AuthFlow/>
			<div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/src/assets/img-login.jpg')" }}></div>
		</div>
	);
}