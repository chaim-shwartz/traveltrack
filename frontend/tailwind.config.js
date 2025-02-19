module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "primary": {
          DEFAULT: "#5adb8f",
          "50": "#e4f9ec",
          "100": "#beefcf",
          "200": "#92e5b0",
          "300": "#5adb8f",
          "400": "#0ad275",
          "500": "#00c95a",
          "600": "#00b850",
          "700": "#00a543",
          "800": "#009436",
          "900": "#007321"
        },
        "secondary": {
          DEFAULT: "#ff875b",
          "50": "#fce8e6",
          "100": "#ffcbb8",
          "200": "#ffa98a",
          "300": "#ff875b",
          "400": "#fe6c36",
          "500": "#fd530b",
          "600": "#f24d06",
          "700": "#e44600",
          "800": "#d63e00",
          "900": "#be3100"
        },

        // primary: '#0ad273',
        // secondary: '#FF885B',
        background: '#fbf3ec',
        text: '#33372C',
        text_secondary: '#585c51',
      },

    },
  },
  plugins: [
    require('tailwindcss-rtl'), // RTL plugin
  ],
};
