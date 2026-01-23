/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },  
    extend: {
      colors: {
        /* Base */
        background: "hsl(253.6,100%,95.7%)",
        foreground: "hsl(240 15% 12%)",

        /* Surfaces */
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 15% 12%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 15% 12%)",
        },

        /* Brand */
        primary: {
          DEFAULT: "hsl(262 83% 58%)",
          foreground: "hsl(0 0% 100%)",
        },
        accent: {
          DEFAULT: "hsl(262 70% 65%)",
          foreground: "hsl(0 0% 100%)",
        },

        /* UI */
        secondary: {
          DEFAULT: "hsl(240 16% 96%)",
          foreground: "hsl(240 10% 40%)",
        },
        muted: {
          DEFAULT: "hsl(240 16% 95%)",
          foreground: "hsl(240 8% 45%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 98%)",
        },

        /* Form */
        border: "hsl(240 14% 90%)",
        input: "hsl(240 14% 94%)",
        ring: "hsl(262 83% 58%)",

        /* Utility */
        gray: "#F4F5FB",
      },

      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },


      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
      },

      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
