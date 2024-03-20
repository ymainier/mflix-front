export default function ShowCard({
  title,
  description,
  imagePath,
  onSelect,
}: {
  title: string;
  description: string;
  imagePath: string;
  onSelect: () => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bg-white rounded-lg shadow-md overflow-hidden h-full">
      <img
        src={`https://image.tmdb.org/t/p/w342/${imagePath}`}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="p-4 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-2">{description}</p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
          className="mt-4 sm:mt-0 bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded"
        >
          Select
        </button>
      </div>
    </div>
  );
}
