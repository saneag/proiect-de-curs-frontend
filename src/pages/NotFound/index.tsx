import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <span className="text-6xl font-bold text-blue-600">404</span>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This page doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Home aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
