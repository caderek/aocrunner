import type { Setup, Config } from "../types/common"

const aocrunnerJSON = ({ year, language }: Setup): Config => {
  return {
    version: 1,
    year,
    language,
    days: new Array(25).fill(0).map((_, i) => ({
      part1: {
        solved: false,
        result: null,
        attempts: [],
      },
      part2: {
        solved: false,
        result: null,
        attempts: [],
      },
    })),
  }
}

export default aocrunnerJSON
