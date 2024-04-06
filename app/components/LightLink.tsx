import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import cn from "@/app/lib/cn";

type Props = ComponentPropsWithoutRef<typeof Link>;

export default function LightLink(props: Props): JSX.Element {
  return (
    <Link
      {...props}
      className={cn(
        "bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded",
        props.className
      )}
    />
  );
}
