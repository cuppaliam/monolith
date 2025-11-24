import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <path d="M12 2 L6 5 L6 19 L12 22 L18 19 L18 5 Z" />
    <path d="M6 5 L12 8 L18 5" />
    <path d="M12 8 L12 22" />
  </svg>
);

export default Logo;
