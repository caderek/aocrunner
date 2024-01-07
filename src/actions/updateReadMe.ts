import { saveYearReadme, readYearReadme, saveDayReadme, readDayReadme, readGlobalReadme, saveGlobalReadme } from "../io/readme.js"
import toFixed from "../utils/toFixed.js"
import { stripIndents } from "common-tags"
import { renderGlobalYearInfo } from "../configs/readmeMD.js"
import { renderYearDayBadges, renderYearResults } from "../configs/readmeYearMD.js"
import { readConfig } from "../io/config.js"
import type { YearConfig } from "../types/common"

export const updateReadmes = (currentYear: string, currentDay?: number) => {
	const config = readConfig();
	const yearConfig = config.years.find(y => y.year == Number(currentYear))!;
	updateGlobalReadme(yearConfig);
	updateYearReadme(yearConfig);
	updateDayReadme(yearConfig, currentDay);
}

const updateGlobalReadme = (config: YearConfig) => {
	const globalInfo = renderGlobalYearInfo(config)

	// Update year readme file
	const readme = readGlobalReadme()
		.replace(
			/<!--SOLUTIONS-->(.|\n|\r)+<!--\/SOLUTIONS-->/,
			`<!--SOLUTIONS-->\n\n${globalInfo?.badges ?? ""}\n\n<!--/SOLUTIONS-->`,
		)
		.replace(
			/<!--RESULTS-->(.|\n|\r)+<!--\/RESULTS-->/,
			`<!--RESULTS-->\n\n${globalInfo?.results ?? ""}\n\n<!--/RESULTS-->`,
		)

	saveGlobalReadme(readme);
}

const updateYearReadme = (config: YearConfig) => {
	const badges = renderYearDayBadges(config)
	const results = renderYearResults(config)

	// Update year readme file
	const readme = readYearReadme(config.year)
		.replace(
			/<!--SOLUTIONS-->(.|\n|\r)+<!--\/SOLUTIONS-->/,
			`<!--SOLUTIONS-->\n\n${badges}\n\n<!--/SOLUTIONS-->`,
		)
		.replace(
			/<!--RESULTS-->(.|\n|\r)+<!--\/RESULTS-->/,
			`<!--RESULTS-->\n\n${results}\n\n<!--/RESULTS-->`,
		)

	saveYearReadme(config.year, readme);
}

const updateDayReadme = (config: YearConfig, currentDay?: number) => {
	// Update day readme files
	config.days
		.forEach((d, index) => {
			if ((currentDay == undefined || (currentDay - 1 == index)) && (d.part1.solved || d.part2.solved)) {
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

				const dayReadme = readDayReadme(config.year, index + 1)
					.replace(
						/## Results(.|\n|\r)+## Notes/,
						`## Results\n\n${dayResults}\n\n## Notes`
					);
				
				saveDayReadme(config.year, index + 1, dayReadme)
			}
		});
}

export default updateReadmes
