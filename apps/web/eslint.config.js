import react from "@jijp/eslint-config/react";
import globals from "globals";

export default [
  ...react,
  {
    files: ["**/*.{ts,tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/vite-env.d.ts",
      "src/test/setup.ts",
    ],
  },
];
