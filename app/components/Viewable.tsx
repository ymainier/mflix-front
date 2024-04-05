import { ReactNode } from "react";

export function Viewable({
  isCompleted,
  children,
}: {
  isCompleted: boolean;
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      className={`transition ease-in-out ${
        isCompleted ? "grayscale opacity-50" : ""
      }`}
    >
      {children}
    </div>
  );
}
