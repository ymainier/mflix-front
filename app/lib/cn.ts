import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}
