import fs from "fs"

const readReadme = (): string => {
  return fs.readFileSync("README.md").toString()
}

const saveReadme = (readme: string) => {
  fs.writeFileSync("README.md", readme)
}

export { saveReadme, readReadme }
