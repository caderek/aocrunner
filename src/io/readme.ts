import fs from "fs"

const readGlobalReadme = (): string => {
	return fs.readFileSync("README.md").toString()
}
  
const saveGlobalReadme = (readme: string) => {
	fs.writeFileSync("README.md", readme)
}

const readYearReadme = (year: number): string => {
  return fs.readFileSync(`src/${year.toString()}/README.md`).toString()
}

const saveYearReadme = (year: number, readme: string) => {
  fs.writeFileSync(`src/${year.toString()}/README.md`, readme)
}

const readDayReadme = (year: number, day: number): string => {
	return fs.readFileSync(`src/${year.toString()}/day${day.toString().padStart(2, '0')}/README.md`).toString()
}
const saveDayReadme = (year:number, day: number, readme: string) => {
	fs.writeFileSync(`src/${year.toString()}/day${day.toString().padStart(2, '0')}/README.md`, readme)
}
  
export { saveGlobalReadme, readGlobalReadme, saveYearReadme, readYearReadme, saveDayReadme, readDayReadme }
