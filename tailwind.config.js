module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}", // Ensure all relevant files are included
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Use your CSS variable
        foreground: "var(--foreground)", // Use your CSS variable
      },
    },
  },
  plugins: [],
};