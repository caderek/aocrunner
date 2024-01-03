import fs from "fs"
import kleur from "kleur"
import path from "path"
import getAllFiles from "../utils/getAllFiles.js"
import buildSource from "./processes/buildSource.js"
import buildDefinitions from "./processes/buildDefinitions.js"

const build = (yearRaw: string) => {
  const year = yearRaw && (yearRaw.match(/\d{4}/) ?? [])[0]

  if (year === undefined) {
    console.log(kleur.red("No year specified."))
    process.exit(1)
  }

  if (fs.existsSync(path.join(year, "dist"))) {
    console.log("Removing old build...")
    fs.rmSync(path.join(year, "dist"), { recursive: true })
    console.log("Building source files...")
  }

  const files = getAllFiles("src")

  buildSource(year, files, false)
  buildDefinitions(year)
}

export default build
