import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const KawaiiCursor = () => {
  const { isCursorCustom } = useSelector(state => state.ui);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isCursorCustom) return;

    const updateMousePosition = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = e => {
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A" ||
        e.target.classList.contains("cursor-pointer") ||
        e.target.closest(".cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = e => {
      setIsHovering(false);
    };

    const handleMouseDown = e => {
      if (
        e.target.classList.contains("cursor-pointer") ||
        e.target.closest(".cursor-pointer") ||
        e.target.classList.contains("drag-handle")
      ) {
        setIsDragging(true);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isCursorCustom]);

  useEffect(() => {
    if (!isCursorCustom) return;

    const animateCursor = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }, [mousePosition, isCursorCustom]);

  if (!isCursorCustom) return null;

  return (
    <>
      {/* Main Kawaii Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorPosition.x - 16,
          y: cursorPosition.y - 16,
        }}
        animate={{
          scale: isHovering ? 1.5 : isDragging ? 2 : 1,
          rotate: isHovering ? 360 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="relative">
          {/* Core Glow */}
          <div
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              isDragging
                ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                : isHovering
                ? "bg-pink-400 shadow-lg shadow-pink-400/50"
                : "bg-bubblegum shadow-lg shadow-bubblegum/50"
            }`}
          />

          {/* Sparkle Effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-0.5" />
            <div className="absolute top-1/2 right-0 w-1 h-1 bg-white rounded-full transform translate-x-0.5 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 translate-y-0.5" />
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-white rounded-full transform -translate-x-0.5 -translate-y-1/2" />
          </motion.div>

          {/* Center Star */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs">
              {isDragging ? "🌟" : isHovering ? "✨" : "🌸"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trail Effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-30"
        style={{
          x: cursorPosition.x - 8,
          y: cursorPosition.y - 8,
        }}
        animate={{
          scale: [1, 0.8, 0],
          opacity: [0.3, 0.2, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: 0.1,
        }}
      >
        <div className="w-4 h-4 bg-bubblegum rounded-full blur-sm" />
      </motion.div>

      {/* Drag Trail */}
      {isDragging && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed top-0 left-0 pointer-events-none z-[9997] opacity-40"
              style={{
                x: cursorPosition.x - 6 - i * 8,
                y: cursorPosition.y - 6 - i * 8,
              }}
              animate={{
                scale: [1, 0.6, 0],
                opacity: [0.4, 0.2, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              <div className="w-3 h-3 bg-blue-400 rounded-full blur-sm" />
            </motion.div>
          ))}
        </>
      )}
    </>
  );
};

export default KawaiiCursor;
