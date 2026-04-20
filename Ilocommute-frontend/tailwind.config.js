/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "half-screen": "50vh",
      },
      width: {
        128: "40rem",
      },
      spacing: {
        128: "29rem",
      },
    },
  },
  plugins: [import('tailwind-scrollbar')],
};
