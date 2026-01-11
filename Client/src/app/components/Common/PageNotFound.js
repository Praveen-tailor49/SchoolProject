import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center">
        <div className="relative inline-block">
          <h1 className="text-[150px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-20 blur-xl"></div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
          <Search className="w-4 h-4" />
          <span className="font-medium">Page Not Found</span>
        </div>

        <p className="mt-8 text-gray-600 text-lg max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist or has been moved to another location.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
