import type { Setup } from "../types/common"

const prettierignoreTXT = ({ language }: Setup) => {
  return language === "ts" ? "lib" : ""
}

export default prettierignoreTXT
