/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00796b',
                background: '#f0f2f5',
                success: '#4caf50', // Green for YES
                danger: '#f44336',  // Red for NO
            },
        },
    },
    plugins: [],
}
