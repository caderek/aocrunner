import fs from "fs"
import getAllFiles from "../utils/getAllFiles"
import buildSource from "./processes/buildSource"
import buildDefinitions from "./processes/buildDefinitions"

const build = () => {
  if (fs.existsSync("dist")) {
    console.log("Removing old build...")
    fs.rmSync("dist", { recursive: true })
    console.log("Building source files...")
  }

  const files = getAllFiles("src")

  buildSource(files)
  buildDefinitions()
}

export default build
