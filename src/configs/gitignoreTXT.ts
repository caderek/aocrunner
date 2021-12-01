import type { Setup } from "../types/common"
import { stripIndent } from "common-tags"

const gitignoreTXT = ({ language }: Setup) => {
  return stripIndent`
    node_modules
    *.temp.*
    */**/*.temp.*
    */**/input.txt
    *.log
    */**/*.log
    .idea
    .vscode
    .env
    ${language === "ts" ? "dist" : ""}
  `
}

export default gitignoreTXT
