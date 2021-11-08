import type { Setup } from "../types/common"

const packageJSON = ({ year, language, author }: Setup) => {
  const build = language === "ts" ? { build: "aocrunner build" } : {}

  return {
    name: `aoc${year}`,
    version: "1.0.0",
    description: `Advent of Code ${year} - solutions`,
    type: "module",
    scripts: {
      day: "aocrunner day",
      ...build,
      format: "prettier -w src",
    },
    keywords: ["aoc"],
    author: author ?? "",
    license: "ISC",
    devDependencies: {
      "@types/node": "^16.11.6",
      aocrunner: "^1.1.0",
      prettier: "^2.4.1",
    },
    dependencies: {},
    engines: { node: ">=16.0.0" },
  }
}

export default packageJSON
