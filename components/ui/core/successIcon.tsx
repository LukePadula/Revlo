"use client";
import { motion } from "framer-motion";

export default function SuccessIcon() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.4, 1],
          opacity: 1,
          boxShadow: [
            "0 0 0px rgba(59,130,246,0)",
            "0 0 40px rgba(59,130,246,0.7)",
            "0 0 25px rgba(59,130,246,0.4)",
          ],
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative w-40 h-40 bg-gradient-to-br bg-brand to-blue-600 rounded-full flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={4}
          stroke="white"
          className="w-24 h-24"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 2, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>

        {/* Gentle pulse after appearing */}
        <motion.div
          className="absolute inset-0 rounded-full bg-brand blur-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.4, 0] }}
          transition={{
            delay: 1.2,
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
