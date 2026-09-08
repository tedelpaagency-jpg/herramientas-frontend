/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        "error": "#FF5630",
        "tertiary-container": "#a33500",
        "warning": "#FFAB00",
        "tertiary": "#7b2600",
        "on-primary-fixed-variant": "#0040a2",
        "inverse-on-surface": "var(--color-surface)",
        "surface-container-high": "var(--color-surface-container-high)",
        "secondary-container": "#82f9be",
        "surface-variant": "var(--color-surface-variant)",
        "primary-fixed": "#dae2ff",
        "primary": "#0052cc",
        "secondary-fixed-dim": "#65dca4",
        "on-secondary": "#ffffff",
        "background": "var(--color-background)",
        "surface-container-highest": "var(--color-surface-variant)",
        "on-primary-container": "#c4d2ff",
        "surface-bright": "var(--color-surface)",
        "inverse-primary": "#b2c5ff",
        "surface-container-lowest": "var(--color-surface)",
        "on-secondary-fixed-variant": "#005235",
        "outline": "var(--color-text-secondary)",
        "surface-tint": "#0c56d0",
        "primary-container": "#0052cc",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#ffb59b",
        "on-primary": "#ffffff",
        "on-error-container": "#93000a",
        "surface-container-low": "var(--color-surface-container)",
        "secondary-fixed": "#82f9be",
        "on-error": "#ffffff",
        "secondary": "#006c47",
        "on-surface-variant": "var(--color-text-secondary)",
        "surface-container": "var(--color-surface-container)",
        "tertiary-fixed": "#ffdbcf",
        "on-tertiary-fixed": "#380d00",
        "on-background": "var(--color-text-primary)",
        "on-tertiary-fixed-variant": "#812800",
        "on-secondary-container": "#00734c",
        "surface": "var(--color-surface)",
        "primary-fixed-dim": "#b2c5ff",
        "inverse-surface": "#2e3038",
        "on-surface": "var(--color-text-primary)",
        "on-tertiary-container": "#ffc6b2",
        "on-secondary-fixed": "#002113",
        "on-primary-fixed": "#001848",
        "outline-variant": "var(--border-outline-variant)",
        "surface-dim": "#d9d9e4",
        "on-tertiary": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "8px",
        "xl": "12px",
        "full": "9999px"
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }]
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
};
