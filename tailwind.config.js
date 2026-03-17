/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      colors: {
        paper:  '#f7f6f2',
        ink:    '#1c1c1c',
        forest: '#3d7068',
        rule:   '#e5e4de',
        muted:  '#b4b4b4',
        warm:   '#f0ede6',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
        full: '9999px',
      },
      boxShadow: {
        hard: '3px 3px 0 0 #1c1c1c',
        'hard-sm': '2px 2px 0 0 #1c1c1c',
        'hard-forest': '3px 3px 0 0 #3d7068',
        none: 'none',
      },
      fontSize: {
        'display-xl': ['clamp(3rem,9vw,8rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem,6vw,5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem,4vw,3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
    },
  },
  plugins: [],
}
