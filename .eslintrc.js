module.exports = {
  extends: "airbnb-base",
  rules: {
    quotes: ["error", "double"],
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "info"],
      },
    ],
    "linebreak-style": ["error", "unix"],
    "no-underscore-dangle": "off",
    "arrow-parens": ["error", "as-needed"],
    "no-mixed-operators": "off",
  },
};
