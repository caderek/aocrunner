import type { Setup, Config } from "../types/common"
import { stripIndent } from "common-tags"

const renderDayBadges = (config: Config) => {
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

      return color !== "gray" ? `[${badge}](src/day${day})` : badge
    })
    .join("\n")
}

const renderResults = (config: Config) => {
  let totalTime = 0
  let totalStars = 0

  const results = config.days
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0")

      if (part1.solved) {
        totalStars++
        totalTime += part1.time ?? 0
      }
      if (part2.solved) {
        totalStars++
        totalTime += part2.time ?? 0
      }

      if (day === "25" && part1.solved) {
        totalStars++
      }

      return stripIndent`
      \`\`\`
      Day ${day}
      Time part 1: ${
        part1.time !== null && part1.solved ? part1.time + "ms" : "-"
      }
      Time part 2: ${
        part2.time !== null && part2.solved ? part2.time + "ms" : "-"
      }
      \`\`\`
    `
    })
    .join("\n\n")

  const summary = `
    \`\`\`
    Total stars: ${totalStars}/50
    Total time: ${totalTime}ms
    \`\`\`
  `

  return [results, summary].join("\n\n")
}

const readmeMD = (
  { language, year }: Setup,
  startCmd: string,
  installCmd: string,
  config: Config,
) => {
  const lang = language === "ts" ? "TypeScript" : "JavaScript"

  const dayBadges = renderDayBadges(config)
  const results = renderResults(config)

  return stripIndent`
    <!-- Entries between SOLUTIONS and RESULTS tags are auto-generated -->

    [![AoC](https://badgen.net/badge/AoC/${year}/blue)](https://adventofcode.com/${year})
    [![Node](https://badgen.net/badge/Node/v16.0.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/${lang}/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code ${year} 🎄

    ## Solutions

    <!--SOLUTIONS-->

    ${dayBadges}

    <!--/SOLUTIONS-->

    _Click a badge to go to the specific day._

    ---

    ## Installation

    \`\`\`
    ${installCmd}
    \`\`\`

    ## Running in dev mode

    \`\`\`
    ${startCmd} <day>
    \`\`\`

    Example:

    \`\`\`
    ${startCmd} 1
    \`\`\`

    ---

    ## Results

    <!--RESULTS-->

    ${results}

    <!--/RESULTS-->

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨
  `
}

export { renderDayBadges, renderResults }
export default readmeMD
