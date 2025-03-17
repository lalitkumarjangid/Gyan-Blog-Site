import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  token: string | null;
}

const Navbar = ({ token }: NavbarProps): JSX.Element => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  
    return (
      <nav className="bg-black text-white py-4 fixed w-full top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold">
            Gyan Blog
          </Link>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="hover:text-gray-300 transition-colors">
              Blogs
            </Link>
            {/* <Link to="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link> */}
            <Link to="/publish" className="hover:text-gray-300 transition-colors">
              Write
            </Link>
            {token ? (
              <>
                <Link
                  to="/#"
                  className="hover:text-gray-300 transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;