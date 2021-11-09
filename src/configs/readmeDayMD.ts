import type { Setup, Config } from "../types/common"
import { stripIndents } from "common-tags"

const readmeDayMD = (year: number, day: number) => {
  return stripIndents`
    # 🎄 Advent of Code ${year} - day ${day} 🎄

    ## Info

    Task description: [link](https://adventofcode.com/${year}/day/${day})

    ## Notes

    ...
  `
}

export default readmeDayMD
