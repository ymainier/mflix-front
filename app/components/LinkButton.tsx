import Link from "next/link";
import { ReactNode } from "react";

export default function LinkButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent rounded ${className}`}
    >
      {children}
    </Link>
  );
}
