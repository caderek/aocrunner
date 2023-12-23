import { saveReadme, readReadme, saveDayReadme, readDayReadme, readGlobalReadme, saveGlobalReadme } from "../io/readme.js"
import toFixed from "../utils/toFixed.js"
import { stripIndents } from "common-tags"
import { renderDayBadges, renderResults } from "../configs/readmeMD.js"
import { readConfig } from "../io/config.js"

export const updateReadme = (currentDay?: number) => {
	const config = readConfig()

	// Update global readme file
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

		let regex = /<!--SOLUTIONS-->(.|\n|\r)+<!--\/SOLUTIONS-->/;
		let match = globalReadme.match(regex);

		if (match != null) {
			const lines = match[0].split("\n");
	
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
					yearInsertIndex = lines.length - 2;
				}

				lines.splice(yearReplaceIndex = yearInsertIndex, 0, "");
			}
		
			if (totalStars >= 49) {
				stars = stars.replace("★", "✨")
			}
			const color = totalStars >= 40 ? "green" : totalStars >= 20 ? "yellow" : "gray";
		
			lines[yearReplaceIndex] = `[![Year](https://badgen.net/badge/${currentYear}/${stars}/${color}?icon=typescript&labelColor=blue&scale=1.3)](${currentYear})  `;
		
			globalReadme = globalReadme.replace(regex, lines.join("\n"));
		}

		regex = /<!--RESULTS-->(.|\n|\r)+<!--\/RESULTS-->/;
		match = globalReadme.match(regex);

		if (match != null) {
			const lines = match[0].split("\n");

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
					yearReplaceIndex = lines.length - 1;
				}
				lines.splice(yearReplaceIndex, 0, ...["", "", "", "", "", ""]);
			}			

			const yearInfo = [
				"```",
				`Year ${currentYear}`,
				`Total stars: ${totalStars}/50`,
				`Total time: ${toFixed(totalTime)}ms`,
				"```",
				""
			]

			lines.splice(yearReplaceIndex, 6, ...yearInfo);
			globalReadme = globalReadme.replace(regex, lines.join("\n"));
		}

		saveGlobalReadme(globalReadme);
	} catch (error) {
		if ( ( error as Error ).message.indexOf( "no such file or directory" ) == -1 ) {
			console.error({ error });		
		}
	}

	const badges = renderDayBadges(config)
	const results = renderResults(config)

	// Update year readme file
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

	// Update day readme files
	config.days.filter((d, index) => (currentDay == undefined || (currentDay - 1 == index)) && (d.part1.solved || d.part2.solved))
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
					`## Results\n\n${dayResults}\n\n## Notes`
				);
			
			console.log(`Updating day ${day} readme...`);
			saveDayReadme(index + 1, dayReadme)
		});
}

export default updateReadme
