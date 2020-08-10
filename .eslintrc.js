module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "linebreak-style": "off", // don't matter line ending style
    indent: ["error", 2], // indent with 2 spaces
    quotes: ["error", "single"], // force single quotes
    semi: ["error", "never"], // remove semicolons
    eqeqeq: "warn", // require === and !==
    "default-case": "warn", // require default case in switch statements
    "no-implicit-coercion": "warn", // disallows implicit type conversion methods
    curly: ["error", "all"],
    yoda: "warn", // requires 'yoda' condition statements
    "no-var": "warn", // requires let or const, not var
  }
};
