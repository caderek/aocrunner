import { saveReadme, readReadme, saveDayReadme, readDayReadme } from "../io/readme.js"
import toFixed from "../utils/toFixed.js"
import { stripIndents } from "common-tags"
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

  config.days.filter(day => day.part1.solved || day.part2.solved)
  .forEach((d, index) => {
	  const day = String(index + 1).padStart(2, "0")
	  const part1 = d.part1;
	  const part2 = d.part2;

	  let timeBoth = 0

	  if (part1.solved) {
		timeBoth += part1.time ?? 0
	  }
	  if (part2.solved) {
		timeBoth += part2.time ?? 0
	  }

	  const dayResults = stripIndents`
		\`\`\`
		Time part 1: ${part1.time !== null && part1.solved ? toFixed(part1.time) + "ms" : "-"}
		Time part 2: ${part2.time !== null && part2.solved ? toFixed(part2.time) + "ms" : "-"}
		Both parts: ${timeBoth !== 0 ? toFixed(timeBoth) + "ms" : "-"}
		\`\`\`
		`;

	  const dayReadme = readDayReadme(index + 1)
		.replace(
		  /## Results(.|\n|\r)+## Notes/,
		  `## Results\n\n${dayResults}\n\n## Notes`,
		)
	
	  console.log(`Updating day ${day} readme...`);
	  saveDayReadme(index + 1, dayReadme)
  });
}

export default updateReadme
