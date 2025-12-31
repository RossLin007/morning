/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../docs/**/*.{md,mdx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#6B8E8E",       // Sage Green
                "primary-dark": "#4A6666",  // Darker Sage
                "accent": "#D4A373",        // Muted Wood/Gold
                "background-light": "#F9F9F6", // Rice Paper
                "background-dark": "#1C1C1E",  // Soft Charcoal
                "surface-light": "#FFFFFF",
                "surface-dark": "#2C2C2E",
                "text-main": "#3E4E50",     // Deep Grey-Green
                "text-sub": "#8C9B9D",      // Muted Grey-Green
            },
            fontFamily: {
                "display": ["Noto Serif SC", "serif"],
                "body": ["Noto Sans SC", "Lexend", "sans-serif"],
            },
            boxShadow: {
                'soft': '0 8px 30px -4px rgba(107, 142, 142, 0.1)',
                'up': '0 -4px 20px -2px rgba(0, 0, 0, 0.03)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        },
    },
    plugins: [],
}