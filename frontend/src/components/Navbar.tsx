import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  token: string | null;
}

const Navbar = ({ token }: NavbarProps): JSX.Element => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    
    const menuVariants = {
      open: {
        opacity: 1,
        height: "auto",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      },
      closed: {
        opacity: 0,
        height: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      },
    };
  
    return (
      <nav className="bg-black text-white py-4 fixed w-full top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="text-2xl font-bold">
                Gyan Blog
              </Link>
            </motion.div>
            
            {/* Hamburger button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg
                animate={isMenuOpen ? "open" : "closed"}
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>

            {/* Desktop menu */}
            <div className="hidden md:flex gap-6">
              {[
                { to: "/", text: "Home" },
                { to: "/blogs", text: "Blogs" },
                { to: "/publish", text: "Write" },
              ].map((item) => (
                <motion.div
                  key={item.to}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {item.text}
                  </Link>
                </motion.div>
              ))}
              
              {token ? (
                <>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Link to="/#" className="hover:text-gray-300 transition-colors">
                      My Account
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="hover:text-gray-300 transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Link to="/signin" className="hover:text-gray-300 transition-colors">
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Link to="/signup" className="hover:text-gray-300 transition-colors">
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="md:hidden mt-4 border-t border-gray-700 overflow-hidden"
              >
                <motion.div 
                  className="flex flex-col space-y-3 pt-3"
                  variants={{
                    open: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {[
                    { to: "/", text: "Home" },
                    { to: "/blogs", text: "Blogs" },
                    { to: "/publish", text: "Write" },
                    ...(token
                      ? [
                          { to: "/#", text: "My Account" },
                          { to: "/logout", text: "Logout", onClick: handleLogout },
                        ]
                      : [
                          { to: "/signin", text: "Sign In" },
                          { to: "/signup", text: "Sign Up" },
                        ]),
                  ].map((item) => (
                    <motion.div
                      key={item.to}
                      variants={{
                        open: { x: 0, opacity: 1 },
                        closed: { x: -20, opacity: 0 },
                      }}
                    >
                      {item.onClick ? (
                        <button
                          onClick={() => {
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          className="hover:text-gray-300 transition-colors text-left w-full"
                        >
                          {item.text}
                        </button>
                      ) : (
                        <Link
                          to={item.to}
                          className="hover:text-gray-300 transition-colors block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.text}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    );
  };

export default Navbar;