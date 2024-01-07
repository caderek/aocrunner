import type { Setup } from "../types/common"
import version from "../version.js"

const packageJSON = ({ year, language, author }: Setup) => {
  const build = language === "ts" ? { build: "aocrunner build" } : {}
  const esbuild = language === "ts" ? { esbuild: "^0.19.8" } : {}
  
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
    devDependencies: {
      "@types/node": "^16.11.6",
      aocrunner: `^${version}`,
	  ...esbuild,
      prettier: "^2.8.0",
    },
    dependencies: {},
    engines: {
      node: ">=16.13.0",
    },
  }
}

export default packageJSON
