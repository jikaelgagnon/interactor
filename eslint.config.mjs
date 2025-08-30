// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ignores: [
      "dist/**/*",
      "eslint.config.mjs",
      "coverage/**/*",
      "src/types/*",
      "src/content.ts",
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)

export default config
