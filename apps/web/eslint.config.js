import react from "@jijp/eslint-config/react";

export default [
  ...react,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/vite-env.d.ts",
      "src/test/setup.ts",
    ],
  },
];
