import { type Config } from "tailwindcss";
// import Color from "color";

export default {
  content: [
    "{routes,islands,components,utils}/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      // colors: {
      // },
    },
  },
} satisfies Config;