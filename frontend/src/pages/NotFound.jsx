import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 px-4">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-6">Page Not Found</p>
        <p className="text-white opacity-80 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary bg-white text-primary hover:bg-gray-100 inline-flex items-center">
          <Home size={20} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
