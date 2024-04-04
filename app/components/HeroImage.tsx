type Props = {
  src: string;
  title: string;
  description: string;
};

export default function HeroImage({
  src,
  title,
  description,
}: Props): JSX.Element {
  return (
    <div className="relative h-[300px]">
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-lg"></div>

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-sm max-h-24 overflow-auto">{description}</p>
        </div>
      </div>
    </div>
  );
}
