import type { Setup } from "../types/common"

const packageJSON = ({ year, language, author }: Setup) => {
  const build = language === "ts" ? { build: "aocrunner build" } : {}

  return {
    name: `aoc${year}`,
    version: "1.0.0",
    description: `Advent of Code ${year} - solutions`,
    type: "module",
    scripts: {
      day: "aocrunner dev",
      ...build,
    },
    keywords: ["aoc"],
    author: author ?? "",
    license: "ISC",
    devDependencies: {
      "@types/node": "^16.11.6",
      aocrunner: "^0.2.17",
    },
    dependencies: {},
    engines: { node: ">=16.0.0" },
  }
}

export default packageJSON
