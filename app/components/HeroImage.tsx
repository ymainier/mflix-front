import { ToggleViewable } from "@/app/components/toggle-viewable";

type Props = {
  id: number;
  kind: "show" | "season";
  src: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export default function HeroImage({
  id,
  kind,
  src,
  title,
  description,
  isCompleted,
}: Props): JSX.Element {
  return (
    <div className="relative h-[300px]">
      <img
        src={src}
        alt={title}
        className={`w-full h-full object-cover rounded-lg transition ease-in-out ${
          isCompleted ? "grayscale opacity-50" : ""
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-lg"></div>

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-sm max-h-24 overflow-auto">{description}</p>
        </div>
      </div>

      <ToggleViewable
        id={id}
        kind={kind}
        isCompleted={!isCompleted}
        className="absolute top-2 right-2 w-12 h-12 leading-[3rem] bg-white rounded-full text-center border cursor-pointer"
      />
    </div>
  );
}
