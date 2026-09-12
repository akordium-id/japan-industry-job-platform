import node from "@jijp/eslint-config/node";

export default [
  ...node,
  {
    ignores: ["dist/**"],
  },
  {
    files: ["src/db/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
