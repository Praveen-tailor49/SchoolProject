import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
        404
      </h1>

      <div className="bg-blue-600 text-white px-3 py-1 rounded rotate-12 absolute mt-20 shadow-lg">
        Page Not Found
      </div>

      <p className="mt-32 text-gray-600 text-lg text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
