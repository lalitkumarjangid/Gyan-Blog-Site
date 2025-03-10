import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleNavigation = () => {
    if (isLoggedIn) {
      navigate('/blogs');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-4 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={handleNavigation}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isLoggedIn ? 'Go to Blogs' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default NotFound;