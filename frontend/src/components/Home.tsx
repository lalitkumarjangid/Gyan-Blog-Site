import { Spotlight } from "./ui/spotlight-new";
import { Button } from "./ui/button";

import { useState } from "react";

export function Home() {
  const token = localStorage.getItem("token");
  const navigateTo = token ? "/blogs" : "/signin";
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = navigateTo;
    }, 100);
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative px-4 sm:px-6 lg:px-8">
      <Spotlight />
      <div className="max-w-7xl mx-auto relative z-10 w-full py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 px-4">
            Welcome to Gyan <br className="md:hidden" /> Blog
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg text-center mx-auto px-4">
            Explore the world of technology through insightful articles,
            tutorials, and the latest developments in software engineering.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Loading...
              </div>
            ) : (
              <>
                Start Reading
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
