"use client"; // Error components must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-4 text-center text-2xl md:text-3xl font-bold">
          Something went wrong!
        </h2>
        <div className="flex flex-row gap-5 items-center">
          <button onClick={() => reset()}>Try again</button>
          <Link className="text-blue-500 hover:text-blue-600" href="/">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
