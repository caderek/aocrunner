import { saveReadme, readReadme } from "../io/readme.js"
import { renderDayBadges, renderResults } from "../configs/readmeMD.js"
import { readConfig } from "../io/config.js"

export const updateReadme = () => {
  const config = readConfig()
  const badges = renderDayBadges(config)
  const results = renderResults(config)

  const readme = readReadme()
    .replace(
      /<!--SOLUTIONS-->(.|\n|\r)+<!--\/SOLUTIONS-->/,
      `<!--SOLUTIONS-->\n\n${badges}\n\n<!--/SOLUTIONS-->`,
    )
    .replace(
      /<!--RESULTS-->(.|\n|\r)+<!--\/RESULTS-->/,
      `<!--RESULTS-->\n\n${results}\n\n<!--/RESULTS-->`,
    )

  saveReadme(readme)
}

export default updateReadme
