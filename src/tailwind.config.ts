import { type Config } from "tailwindcss";
import Color from "color";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        primary: Color("#969696").toString(),
        primaryStrong: Color("#969696").lighten(0.1).toString(),
        primaryLight: Color("#969696").saturate(0.2).lighten(0.1).toString(),
      },
    },
  },
} satisfies Config;