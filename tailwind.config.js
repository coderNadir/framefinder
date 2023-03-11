/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  safelist: ["border-red-400", "border-green-400"],
  theme: {
    extend: {
      animation: {
        shake: "shake 1s cubic-bezier(.36,.07,.19,.97) infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
