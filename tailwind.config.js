const colors = require("tailwindcss/colors")

module.exports = {
  purge: {
    enabled: true,
    content: [
      "./src/**/*.html",
      "./src/**/*.js",
      "./src/**/*.jsx",
      "./src/**/*.ts",
      "./src/**/*.tsx",
    ],
  },
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        red: "#EB4C42",
        "text-blue-dark": "#9a9da3",
        "gray-imex": "#9a9da3",
        "blue-imex": "#004b91",
        "green-imex": "#70ac2d",
        "green-tra": "#38a16f",

        blue: "#376AED",
        cyan: "#8FE6FF",
        "gray-dark": "#7B8BB2",
        gray: "#D7DDEC",
        pink: "#FF3743",
      },
      boxShadow: {
        1: "0px -3px 20px rgba(45, 45, 45, 0.141444)",
        2: "0px 16px 32px rgba(13, 37, 60, 0.44)",
        3: " 0px 10px 15px rgba(82, 130, 255, 0.06)",
      },
    },
  },
}
