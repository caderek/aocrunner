import type { Setup, Config, DayConfig } from "../types/common"

const aocrunnerDaysJSON = (): DayConfig[] => new Array(25).fill(0).map((_, i) => ({
	title: null,
	part1: {
		solved: false,
		result: null,
		attempts: [],
		time: null,
	},
	part2: {
		solved: false,
		result: null,
		attempts: [],
		time: null,
	},
}));

const aocrunnerJSON = ({ year, packageManager, language }: Setup): Config => {
  return {
    version: 1,
    language,
	packageManager,
	years: [
		{
			year,
			days: aocrunnerDaysJSON()
		}
	]
  }
}

export { aocrunnerDaysJSON }
export default aocrunnerJSON
