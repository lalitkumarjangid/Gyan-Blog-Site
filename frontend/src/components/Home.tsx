import { motion } from "framer-motion";

import { AuroraBackground } from "./ui/aurora-background";
import { Link } from "react-router-dom";

export function Home() {
  return (
    
    <AuroraBackground className="bg-gray-900">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="flex justify-center px-10 py-4 mt-[-5]">
      <h3 className="font-bold text-3xl md:text-7xl mb-10 mt- font-serif text-white no-underline">Gyan</h3>
    </div>
        <div className="text-3xl md:text-7xl font-bold text-white text-center">
        Code illuminates, bugs ignite: 
        </div>
        <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4">
        Developer insights.
        </div>
        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
  <Link to="/Signin">Get Started</Link>
  </span>
</button>
      </motion.div>
    </AuroraBackground>
   
  );
}
