import type { Setup } from "../types/common"
import { stripIndent } from "common-tags"

const readmeMD = (
  { language, year }: Setup,
  startCmd: string,
  installCmd: string,
) => {
  const lang = language === "ts" ? "TypeScript" : "JavaScript"

  return stripIndent`
    <!-- Entries between SOLUTIONS/SOLUTIONS_END and RESULTS/RESULTS_END tags are auto-generated -->

    [![AoC](https://badgen.net/badge/AoC/${year}/blue)](https://adventofcode.com/${year})
    [![Node](https://badgen.net/badge/Node/v16.0.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/${lang}/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code ${year} 🎄

    ## Solutions

    <!-- SOLUTIONS -->

    ...

    <!-- SOLUTIONS_END -->

    _Click a badge to go to the specific day._

    ---

    ## Commands

    ### Installation

    \`\`\`
    ${installCmd}
    \`\`\`


    ### Running in dev mode

    \`\`\`
    ${startCmd} <day>
    \`\`\`

    Example:

    \`\`\`
    ${startCmd} 1
    \`\`\`

    ---

    ## Results

    <!-- RESULTS -->

    ...

    <!-- RESULTS_END -->

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨
  `
}

export default readmeMD
