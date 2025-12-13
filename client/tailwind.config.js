/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ruha Kawaii Color Palette
        blush: "#FFF0F5",
        lavender: "#E6E6FA",
        bubblegum: "#FF69B4",
        "electric-teal": "#00CED1",
        sunshine: "#FFD700",
        "dark-slate": "#2F4F4F",
      },
      fontFamily: {
        heading: ["Fredoka One", "cursive"],
        body: ["Quicksand", "sans-serif"],
        alt: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        kawaii: "24px",
        "kawaii-lg": "32px",
        "kawaii-xl": "48px",
      },
      boxShadow: {
        kawaii: "0 8px 32px rgba(255, 105, 180, 0.3)",
        "kawaii-soft": "0 4px 16px rgba(255, 105, 180, 0.2)",
        "kawaii-glow": "0 0 24px rgba(255, 105, 180, 0.4)",
        clay: "0 8px 24px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "bounce-gentle": "bounce 2s infinite",
        "pulse-soft": "pulse 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        squish: "squish 0.2s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        squish: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      backdropBlur: {
        kawaii: "12px",
      },
    },
  },
  plugins: [],
};
