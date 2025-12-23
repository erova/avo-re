import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import mdx from "eslint-plugin-mdx";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // MDX: allow components that are provided at runtime via MDXRemote
  {
    files: ["**/*.mdx"],
    plugins: { mdx },
    rules: {
      "mdx/no-undefined-components": [
        "error",
        {
          allow: ["MetricTiles", "OutlineSection", "PrimaryCta", "Callout"],
        },
      ],
    },
  },
]);

export default eslintConfig;