import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js recommended ESLint config for React and TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    // Custom rules and overrides
    rules: {
      // Disable unused variables rule (already disabled, but ensuring clarity)
      "@typescript-eslint/no-unused-vars": "off",

      // Disable React Hooks exhaustive deps warning
      "react-hooks/exhaustive-deps": "off",

      // Disable unescaped entities rule
      "react/no-unescaped-entities": "off",

      // Existing rules from your config
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // Optional stricter type safety rules (commented out as in your config)
      // "@typescript-eslint/strict-boolean-expressions": "warn",
      // "@typescript-eslint/no-non-null-assertion": "warn",
      // "@typescript-eslint/explicit-module-boundary-types": "warn",
    },
  },
];

export default eslintConfig;