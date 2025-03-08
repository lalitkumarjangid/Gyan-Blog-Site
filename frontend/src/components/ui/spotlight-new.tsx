import { ReactNode, type FC } from 'react';
import { motion } from "framer-motion";

interface SpotlightProps {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    translateY?: number;
    width?: number;
    height?: number;
    smallWidth?: number;
    duration?: number;
    xOffset?: number;
    children?: ReactNode;
    className?: string;
  }

export const Spotlight: FC<SpotlightProps> = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}) => {
  const gradientStyles = {
    first: {
      transform: `translateY(${translateY}px) rotate(-45deg)`,
      background: gradientFirst,
      width: `${width}px`,
      height: `${height}px`,
    },
    second: {
      width: `${smallWidth}px`,
      height: `${height}px`,
      background: gradientSecond,
    },
    third: {
      width: `${smallWidth}px`,
      height: `${height}px`,
      background: gradientThird,
    }
  };

  const motionConfig = {
    duration,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={motionConfig}
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={gradientStyles.first}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            ...gradientStyles.second,
            transform: "rotate(-45deg) translate(5%, -50%)",
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            ...gradientStyles.third,
            transform: "rotate(-45deg) translate(-180%, -70%)",
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={motionConfig}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            ...gradientStyles.first,
            transform: `translateY(${translateY}px) rotate(45deg)`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            ...gradientStyles.second,
            transform: "rotate(45deg) translate(-5%, -50%)",
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            ...gradientStyles.third,
            transform: "rotate(45deg) translate(180%, -70%)",
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};