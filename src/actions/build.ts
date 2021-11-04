import fs from "fs"
import getAllFiles from "../utils/getAllFiles.js"
import buildSource from "./processes/buildSource.js"
import buildDefinitions from "./processes/buildDefinitions.js"

const build = () => {
  if (fs.existsSync("dist")) {
    console.log("Removing old build...")
    fs.rmSync("dist", { recursive: true })
    console.log("Building source files...")
  }

  const files = getAllFiles("src")

  buildSource(files, false)
  buildDefinitions()
}

export default build
