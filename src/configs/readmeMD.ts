import type { Setup, YearConfig } from "../types/common"
import { stripIndents } from "common-tags"
import toFixed from "../utils/toFixed.js"
import { readGlobalReadme } from "../io/readme.js"

const renderGlobalYearInfo = (config: YearConfig) => {
	try {
		const currentYear = config.year;
		let globalReadme = readGlobalReadme();

		let totalStars = 0;
		let totalTime = 0;
		let stars = config.days
			.map(({ part1, part2 }, index) => {
				if (part1.solved) {
					totalStars++;
					totalTime += part1.time ?? 0;
				}
				if (part2.solved) {
					totalStars++;
					totalTime += part2.time ?? 0;
				}
				const star =
					part1.solved && part2.solved ? "★" :
						part1.solved || part2.solved ? "☆" : "⭒";
	
				return star;
			}).join("");

		let regex = /<!--SOLUTIONS-->([\s\S]+?)<!--\/SOLUTIONS-->/;
		let match = globalReadme.match(regex);
		let badges = "";
		let results = "";

		if (match != null) {
			const lines = match[1].split("\n").filter(line => line.trim() != "");
	
			let yearReplaceIndex = lines.findIndex(line => line.includes(`badge/${currentYear}`));
	
			if (yearReplaceIndex == -1) {
				// Find position...
				let yearInsertIndex = -1;
				for (let index = 0; index < lines.length; index++) {
					const [left, right] = lines[index].split("badge/");
					if (right != undefined) {
						if ( Number(right.substring(0, 4)) < currentYear ) {
							yearInsertIndex = index;
							break;
						}
					}
				}

				if (yearInsertIndex == -1) {
					yearInsertIndex = lines.length;
				}

				lines.splice(yearReplaceIndex = yearInsertIndex, 0, "");
			}
		
			if (totalStars >= 49) {
				stars = stars.replaceAll("★", "✨")
			}
			const color = totalStars >= 40 ? "green" : totalStars >= 20 ? "yellow" : "gray";
		
			lines[yearReplaceIndex] = `[![Year](https://badgen.net/badge/${currentYear}/${stars}/${color}?icon=typescript&labelColor=blue&scale=1.3)](src/${currentYear})  `;
		
			badges = lines.join("\n");
		}

		regex = /<!--RESULTS-->([\s\S]+?)<!--\/RESULTS-->/;
		match = globalReadme.match(regex);

		if (match != null) {
			const lines = match[1].split("\n").filter(line => line.trim() != "");

			let yearReplaceIndex = lines.findIndex(line => line.includes(`Year ${currentYear}`)) - 1;
	
			if (yearReplaceIndex < 0) {
				// Find position...
				let yearInsertIndex = -1;
				for (let index = 0; index < lines.length; index++) {
					const [left, right] = lines[index].split("Year ");
					if (right != undefined) {
						if ( Number(right) < currentYear ) {
							yearInsertIndex = index - 1;
							break;
						}
					}
				}

				if (yearInsertIndex > -1) {
					yearReplaceIndex = yearInsertIndex;
				}
				else {
					yearReplaceIndex = lines.length;
				}
				lines.splice(yearReplaceIndex, 0, ...["", "", "", "", "", ""]);
			}			

			const yearInfo = [
				"",
				"```",
				`Year ${currentYear}`,
				`Total stars: ${totalStars}/50`,
				`Total time: ${toFixed(totalTime)}ms`,
				"```"
			]

			lines.splice(yearReplaceIndex, 6, ...yearInfo);
			results = lines.join("\n");
		}

		return { badges, results };
	} catch (error) {
		if ( ( error as Error ).message.indexOf( "no such file or directory" ) == -1 ) {
			console.error({ error });		
		}
		return undefined;
	}
}

const readmeMD = (
  { language }: Setup,
  startCmd: string,
  installCmd: string
) => {
  const lang = language === "ts" ? "TypeScript" : "JavaScript"
  const yearBadges = ""
  const results = ""
  
  return stripIndents`
    <!-- Entries between SOLUTIONS and RESULTS tags are auto-generated -->

    [![Node](https://badgen.net/badge/Node/v16.13.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/${lang}/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code 🎄

    ## Solutions

    <!--SOLUTIONS-->

    ${yearBadges}

    <!--/SOLUTIONS-->

    _Click a badge to go to the specific year._

    ---

    ## Installation

    \`\`\`
    ${installCmd}
    \`\`\`

    ## Running in dev mode

    \`\`\`
    ${startCmd} <year> <day>
    \`\`\`

    Example:

    \`\`\`
    ${startCmd} 2023 1
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

export { renderGlobalYearInfo }
export default readmeMD