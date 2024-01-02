/** @type {import("prettier").Options} */
const config = {
    trailingComma: "es5",
    tabWidth: 5,
    semi: false,
    singleQuote: true,
    plugins: ["prettier-plugin-tailwindcss"],
    bracketSameLine: true,
    printWidth: 80,
    trailingComma: "none",
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: "always",
};

module.exports = config;
