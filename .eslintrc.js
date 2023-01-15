module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "standard-with-typescript"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": ['./tsconfig.json'],
        "tsconfigRootDir": __dirname
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/quotes": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/promise-function-async": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "multiline-ternary": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/comma-dangle": "off",
      "no-labels": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/restrict-template-expressions": "off"
    }
}
