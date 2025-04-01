import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float-up-left': 'floatUpLeft 1s forwards',
        'float-up-right': 'floatUpRight 1s forwards',
        'float-down-left': 'floatDownLeft 1s forwards',
        'float-down-right': 'floatDownRight 1s forwards',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        floatUpLeft: {
          '0%': { transform: 'translate(0, 0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translate(-20px, -20px) rotate(-45deg)', opacity: '0' },
        },
        floatUpRight: {
          '0%': { transform: 'translate(0, 0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translate(20px, -20px) rotate(45deg)', opacity: '0' },
        },
        floatDownLeft: {
          '0%': { transform: 'translate(0, 0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translate(-20px, 20px) rotate(-45deg)', opacity: '0' },
        },
        floatDownRight: {
          '0%': { transform: 'translate(0, 0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translate(20px, 20px) rotate(45deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 