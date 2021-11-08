import fs from "fs"
import path from "path"
import { stripIndent } from "common-tags"
import chokidar from "chokidar"
import kleur from "kleur"
import getAllFiles from "../utils/getAllFiles.js"
import buildSource from "./processes/buildSource.js"
import runSolution from "./processes/runSolution.js"
import copy from "../io/copy.js"
import { readConfig, saveConfig } from "../io/config.js"
import { getInput, sendSolution, Status } from "../io/api.js"

import type { Config } from "../types/common"

const send = async (config: Config, dayNum: number, part: 1 | 2) => {
  console.log(`\nPart ${part}:`)
  const dayData =
    part === 1 ? config.days[dayNum - 1].part1 : config.days[dayNum - 1].part2

  if (dayData.solved) {
    console.log(kleur.green(`Already solved!`))
    return true
  } else if (dayData.attempts.includes(dayData.result)) {
    console.log(kleur.yellow("You already tried this solution, skipping."))
    return false
  } else if (dayData.result !== null) {
    const status = await sendSolution(config.year, dayNum, 1, dayData.result)

    if (status === Status["SOLVED"]) {
      config.days[dayNum - 1][part === 1 ? "part1" : "part2"].solved = true
      saveConfig(config)
      return true
    }

    if (status === Status["WRONG"]) {
      config.days[dayNum - 1][part === 1 ? "part1" : "part2"].attempts.push(
        dayData.result,
      )
      saveConfig(config)
    }
  } else {
    console.log(kleur.yellow(`Solution is undefined, skipping.`))
  }

  return false
}

const dev = (dayRaw: string | undefined) => {
  const day = dayRaw && (dayRaw.match(/\d+/) ?? [])[0]
  const config = readConfig()

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
  const indexFile = path.join(
    config.language === "ts" ? "dist" : "src",
    dayDir,
    "index.js",
  )
  const inputPath = path.join(toDir, "input.txt")

  if (!fs.existsSync(fromDir)) {
    console.log(kleur.red("Template folder does not exist!"))
  }

  if (!fs.existsSync(toDir)) {
    console.log("Creating from template...")
    copy(fromDir, toDir)
    fs.writeFileSync(inputPath, "")
  }

  const files = getAllFiles("src")

  if (config.language === "ts") {
    buildSource(files)
  }

  const boldMagenta = kleur.bold().magenta

  console.log("")
  console.log(stripIndent`
    Type ${boldMagenta("fetch")} or ${boldMagenta("f")} - to fetch the input
    Type ${boldMagenta("send")}  or ${boldMagenta("s")} - to send the solution
  `)

  runSolution(dayNum, indexFile)

  chokidar
    .watch("src", { ignoreInitial: true })
    .on("add", (file) => {
      if (config.language === "ts") {
        buildSource(file)
      }
      runSolution(dayNum, indexFile)
    })
    .on("change", (file) => {
      if (config.language === "ts") {
        buildSource(file)
      }
      runSolution(dayNum, indexFile)
    })

  process.stdin.on("data", async (chunk) => {
    const data = chunk.toString()
    const config = readConfig()

    if (/f(etch){0,1}\n/.test(data)) {
      getInput(config.year, dayNum, inputPath)
    } else if (/s(end){0,1}\n/.test(data)) {
      const solved = await send(config, dayNum, 1)

      if (solved) {
        await send(config, dayNum, 2)
      }
    }
  })
}

export default dev
