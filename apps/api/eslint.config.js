import node from "@jijp/eslint-config/node";

export default [
  ...node,
  {
    ignores: ["dist/**"],
  },
];
