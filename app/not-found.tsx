import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-4 text-center text-2xl md:text-3xl font-bold">
          Not Found
        </h2>
        <p className="text-center text-lg md:text-xl mb-2">
          Could not find requested resource
        </p>
        <Link className="text-blue-500 hover:text-blue-600" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
