import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Spotlight } from "./ui/spotlight-new";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(token ? "/blogs" : "/signin");
    }, 100);
  };

  // Sample data for featured posts with added date field
  const featuredPosts = [
    {
      id: 39,
      title: "The Future of AI",
      excerpt: "Discover how AI is shaping the tech world.",
      image:
        "https://res.cloudinary.com/dmurkxwal/image/upload/v1742233812/miq2pzyeivpoyrkvwpmc.jpg",
      date: "Just Now",
    },
    {
      id: 34,
      title: "React Tips & Tricks",
      excerpt: "Level up your React skills with these hacks.",
      image:
        "https://res.cloudinary.com/dmurkxwal/image/upload/v1742234071/mhvgzivj2l6dlo5qzld7.jpg",
      date: "Just Now",
    },
    {
      id: 47,
      title: "Web3 Explained",
      excerpt: "A beginner’s guide to decentralized tech.",
      image:
        "https://res.cloudinary.com/dmurkxwal/image/upload/v1742233924/s30qd0gc57mxmwipbvnu.jpg",
      date: "1 Min Ago",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-black/[0.96] text-white">
      {/* Navbar */}
      <Navbar token={token} />

      {/* Hero Section */}
      <div className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden">
        <Spotlight />
        <div className="relative z-10 max-w-7xl mx-auto w-full py-12 sm:py-16 md:py-20 lg:py-24 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            Welcome to Gyan Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg mx-auto mt-4"
          >
            Explore the world of technology through insightful articles,
            tutorials, and the latest developments in software engineering.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleClick}
              disabled={isLoading}
              className="mt-4 relative group overflow-hidden border border-white/20 
              bg-transparent hover:bg-transparent hover:border-white/40 
              transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="relative z-10 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-medium" />
                  Loading...
                </div>
              ) : (
                <>
                  Start Reading
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Featured Posts Section with Hover Effects */}
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <Link to={`/blog/${post.id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg hover:opacity-90 transition-opacity duration-300"
                  />

                  <h3 className="text-xl font-bold mt-4">{post.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Published on {post.date}
                  </p>
                  <p className="text-gray-300 mt-2">{post.excerpt}</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-neutral-400 text-neutral-200 hover:bg-neutral-700"
                  >
                    Read More
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
