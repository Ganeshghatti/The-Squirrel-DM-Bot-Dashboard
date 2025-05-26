"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust import based on your Shadcn UI setup

// Main container animations (reusing from original)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

// Child element animations
const childVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export default function ComingSoonSkeleton() {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 px-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo/Icon */}
        <motion.div className="mb-8" variants={childVariants}>
          <Skeleton className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50" />
        </motion.div>

        {/* Main Heading */}
        <motion.div className="mb-6" variants={childVariants}>
          <Skeleton className="h-16 md:h-20 lg:h-24 w-[300px] md:w-[400px] lg

System: :w-[500px] mx-auto bg-slate-800/50" />
        </motion.div>

   
        {/* Countdown Timer */}
        <motion.div className="mb-12" variants={childVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-16 w-full rounded-2xl bg-slate-800/50" />
                <Skeleton className="h-4 w-16 mx-auto mt-2 bg-slate-800/50" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div className="mb-12 max-w-md mx-auto" variants={childVariants}>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-32 bg-slate-800/50" />
            <Skeleton className="h-4 w-12 bg-slate-800/50" />
          </div>
          <Skeleton className="h-2 w-full rounded-full bg-slate-800/50" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={childVariants}
        >
          <Skeleton className="h-12 w-40 rounded-full bg-slate-800/50" />
          <Skeleton className="h-12 w-48 rounded-full bg-slate-800/50" />
        </motion.div>

        {/* Social Proof */}
    
      </div>
    </motion.div>
  );
}