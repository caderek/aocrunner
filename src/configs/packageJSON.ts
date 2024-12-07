import type { Setup } from "../types/common"
import version from "../version.js"

const packageJSON = ({
  year,
  language,
  author,
  tabWidth,
  nodeVersion,
}: Setup) => {
  const build = language === "ts" ? { build: "aocrunner build" } : {}
  const tsdeps = language === "ts" ? { "@types/node": `^${nodeVersion}` } : {}

  return {
    name: `aoc${year}`,
    version: "1.0.0",
    description: `Advent of Code ${year} - solutions`,
    type: "module",
    scripts: {
      start: "aocrunner day",
      ...build,
      format: "prettier -w src",
      "update:readme": "aocrunner update:readme",
    },
    keywords: ["aoc"],
    author: author ?? "",
    license: "ISC",
    aocrunner: {
      tabWidth,
    },
    devDependencies: {
      ...tsdeps,
      aocrunner: `^${version}`,
      prettier: "^2.8.0",
    },
    dependencies: {},
    engines: {
      node: `^${nodeVersion}`,
    },
  }
}

export default packageJSON
