"use client";
import { ReactNode } from "react";
import { focus } from "../lib/vlcInterface";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

function Button({ onClick, children, className = "" }: ButtonProps) {
  return (
    <button
      className={`text-white bg-red-700 rounded-full p-2 text-center inline-flex items-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Focus() {
  return (
    <Button onClick={focus} className="mx-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <span className="sr-only">Focus</span>
    </Button>
  );
}
