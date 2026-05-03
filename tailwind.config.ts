import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        clay: {
                                light: '#F5F0E8',
                                medium: '#E8DFD0',
                                cream: '#FDF9F3',
                                soft: '#F0E9E2',
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                animation: {
                        'gradient-shift': 'gradientShift 15s ease infinite',
                        'gradient-reverse': 'gradientReverse 20s ease infinite',
                        'float-1': 'float1 8s ease-in-out infinite',
                        'float-2': 'float2 10s ease-in-out infinite',
                        'float-3': 'float3 12s ease-in-out infinite',
                        'float-4': 'float4 9s ease-in-out infinite',
                        'accordion-down': 'accordion-down 0.3s ease-out',
                        'accordion-up': 'accordion-up 0.3s ease-out',
                },
                keyframes: {
                        gradientShift: {
                                '0%, 100%': {
                                        backgroundPosition: '0% 50%',
                                        opacity: '1',
                                },
                                '50%': {
                                        backgroundPosition: '100% 50%',
                                        opacity: '0.8',
                                },
                        },
                        gradientReverse: {
                                '0%, 100%': {
                                        backgroundPosition: '100% 50%',
                                        opacity: '0.5',
                                },
                                '50%': {
                                        backgroundPosition: '0% 50%',
                                        opacity: '0.7',
                                },
                        },
                        float1: {
                                '0%, 100%': {
                                        transform: 'translate(0, 0) scale(1)',
                                },
                                '33%': {
                                        transform: 'translate(30px, -50px) scale(1.1)',
                                },
                                '66%': {
                                        transform: 'translate(-20px, 20px) scale(0.9)',
                                },
                        },
                        float2: {
                                '0%, 100%': {
                                        transform: 'translate(0, 0) scale(1)',
                                },
                                '33%': {
                                        transform: 'translate(-40px, 30px) scale(0.95)',
                                },
                                '66%': {
                                        transform: 'translate(20px, -40px) scale(1.05)',
                                },
                        },
                        float3: {
                                '0%, 100%': {
                                        transform: 'translate(0, 0) scale(1)',
                                },
                                '33%': {
                                        transform: 'translate(50px, 20px) scale(1.1)',
                                },
                                '66%': {
                                        transform: 'translate(-30px, -30px) scale(0.9)',
                                },
                        },
                        float4: {
                                '0%, 100%': {
                                        transform: 'translate(0, 0) scale(1)',
                                },
                                '33%': {
                                        transform: 'translate(-20px, -60px) scale(0.95)',
                                },
                                '66%': {
                                        transform: 'translate(40px, 10px) scale(1.05)',
                                },
                        },
                        'accordion-down': {
                                from: { height: '0' },
                                to: { height: 'var(--radix-accordion-content-height)' },
                        },
                        'accordion-up': {
                                from: { height: 'var(--radix-accordion-content-height)' },
                                to: { height: '0' },
                        },
                },
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
