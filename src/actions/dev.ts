import fs from "fs"
import path from "path"
import { stripIndent } from "common-tags"
import chokidar from "chokidar"
import kleur from "kleur"
import getAllFiles from "../utils/getAllFiles.js"
import buildSource from "./processes/buildSource.js"
import runSolution from "./processes/runSolution.js"
import copy from "../io/copy.js"

const dev = (dayRaw: string | undefined) => {
  const day = dayRaw && (dayRaw.match(/\d+/) ?? [])[0]

  if (day === undefined) {
    console.log(kleur.red("No day specified."))
    process.exit(1)
  }

  const dayNum = Number(day)

  if (dayNum < 1 || dayNum > 25) {
    console.log(kleur.red("Wrong day - chose day between 1 and 25."))
    process.exit(1)
  }

  const dayDir = `day${String(dayNum).padStart(2, "0")}`
  const fromDir = path.join("src", "template")
  const toDir = path.join("src", dayDir)
  const indexFile = path.join("dist", dayDir, "index.js")

  if (!fs.existsSync(fromDir)) {
    console.log(kleur.red("Template folder does not exist!"))
  }

  if (!fs.existsSync(toDir)) {
    console.log("Creating from template...")
    copy(fromDir, toDir)
  }

  const files = getAllFiles("src")

  buildSource(files)

  const boldMagenta = kleur.bold().magenta

  console.log("")
  console.log(stripIndent`
    Type:
    
      ${boldMagenta("fetch")} or ${boldMagenta("f")} - to fetch the input
      ${boldMagenta("send")}  or ${boldMagenta("s")} - to send the solution
  `)

  runSolution(dayNum, indexFile)

  chokidar
    .watch("src", { ignoreInitial: true })
    .on("add", (file) => {
      buildSource(file)
      runSolution(dayNum, indexFile)
    })
    .on("change", (file) => {
      buildSource(file)
      runSolution(dayNum, indexFile)
    })

  process.stdin.on("data", function (chunk) {
    const data = chunk.toString()

    if (/f(etch){0,1}\n/.test(data)) {
      console.log("Fetching!")
    } else if (/s(end){0,1}\n/.test(data)) {
      console.log("Send!")
    }
  })
}

export default dev
