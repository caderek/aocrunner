import type { Setup } from "../types/common"

const prettierJSON = ({ semicolons, tabWidth }: Setup) => {
  return {
    arrowParens: "always",
    bracketSpacing: true,
    printWidth: 80,
    proseWrap: "preserve",
    semi: semicolons,
    singleQuote: false,
    tabWidth,
    useTabs: false,
    trailingComma: "all",
  }
}

export default prettierJSON
