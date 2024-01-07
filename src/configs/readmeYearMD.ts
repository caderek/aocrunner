import type { YearConfig } from "../types/common"
import { stripIndents } from "common-tags"
import toFixed from "../utils/toFixed.js"

const renderYearDayBadges = (config: YearConfig) => {
  return config.days
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0")

      const color =
        (part1.solved && part2.solved) || (part1.solved && day === "25")
          ? "green"
          : part1.solved || part2.solved
          ? "yellow"
          : "gray"

      const badge = `![Day](https://badgen.net/badge/${day}/%E2%98%8${
        part1.solved ? 5 : 6
      }%E2%98%8${
        part2.solved || (part1.solved && day === "25") ? 5 : 6
      }/${color})`

      return color !== "gray" ? `[${badge}](day${day})` : badge
    })
    .join("\n")
}

const renderYearResults = (config: YearConfig) => {
  let totalTime = 0
  let totalStars = 0

  const results = config.days
    .map(({ title, part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0")

      let timeBoth = 0

      if (part1.solved) {
        totalStars++
        totalTime += part1.time ?? 0
        timeBoth += part1.time ?? 0
      }
      if (part2.solved) {
        totalStars++
        totalTime += part2.time ?? 0
        timeBoth += part2.time ?? 0
      }

      if (day === "25" && part1.solved) {
        totalStars++
      }

      return stripIndents`
      \`\`\`
      Day ${day}${title != null ? " - " + title : ""}
      Time part 1: ${
        part1.time !== null && part1.solved ? toFixed(part1.time) + "ms" : "-"
      }
      Time part 2: ${
        part2.time !== null && part2.solved ? toFixed(part2.time) + "ms" : "-"
      }
      Both parts: ${timeBoth !== 0 ? toFixed(timeBoth) + "ms" : "-"}
      \`\`\`
    `
    })
    .join("\n\n")

  const summary = stripIndents`
    \`\`\`
    Total stars: ${totalStars}/50
    Total time: ${toFixed(totalTime)}ms
    \`\`\`
  `

  return [results, summary].join("\n\n")
}

const readmeYearMD = (
  language: string,
  config: YearConfig,
) => {
  const lang = language === "ts" ? "TypeScript" : "JavaScript"

  const dayBadges = renderYearDayBadges(config)
  const results = renderYearResults(config)

  return stripIndents`
    <!-- Entries between SOLUTIONS and RESULTS tags are auto-generated -->

    [![AoC](https://badgen.net/badge/AoC/${config.year}/blue)](https://adventofcode.com/${config.year})
    [![Node](https://badgen.net/badge/Node/v16.13.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/${lang}/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code ${config.year} 🎄

    ## Solutions

    <!--SOLUTIONS-->

    ${dayBadges}

    <!--/SOLUTIONS-->

    _Click a badge to go to the specific day._

    ---

    ## Results

    <!--RESULTS-->

    ${results}

    <!--/RESULTS-->

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨
  `
}

export { renderYearDayBadges, renderYearResults }
export default readmeYearMD
