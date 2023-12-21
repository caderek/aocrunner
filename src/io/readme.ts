import fs from "fs"

const readReadme = (): string => {
  return fs.readFileSync("README.md").toString()
}

const saveReadme = (readme: string) => {
  fs.writeFileSync("README.md", readme)
}

const readDayReadme = (day: number): string => {
	return fs.readFileSync(`src/day${day.toString().padStart(2, '0')}/README.md`).toString()
}
const saveDayReadme = (day: number, readme: string) => {
	fs.writeFileSync(`src/day${day.toString().padStart(2, '0')}/README.md`, readme)
}
  
export { saveReadme, readReadme, saveDayReadme, readDayReadme }
