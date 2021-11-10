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
import { saveReadme, readReadme } from "../io/readme.js"
import { renderDayBadges, renderResults } from "../configs/readmeMD.js"
import readmeDayMD from "../configs/readmeDayMD.js"
import asciiPrompt, { AsciiOptions } from "../prompts/asciiPrompt.js"
import commandPrompt from "../prompts/commandPrompt.js"

import type { Config } from "../types/common"

const boldMagenta = kleur.bold().magenta

const showInfo = () => {
  console.log()
  console.log(stripIndent`
    Type ${boldMagenta("fetch")} or ${boldMagenta("f")} - to fetch the input
    Type ${boldMagenta("send")}  or ${boldMagenta("s")} - to send the solutions
  `)
  console.log()
}

const updateReadme = () => {
  const config = readConfig()
  const badges = renderDayBadges(config)
  const results = renderResults(config)

  const readme = readReadme()
    .replace(
      /<!--SOLUTIONS-->(.|\n)+<!--\/SOLUTIONS-->/,
      `<!--SOLUTIONS-->\n\n${badges}\n\n<!--/SOLUTIONS-->`,
    )
    .replace(
      /<!--RESULTS-->(.|\n)+<!--\/RESULTS-->/,
      `<!--RESULTS-->\n\n${results}\n\n<!--/RESULTS-->`,
    )

  saveReadme(readme)
}

const send = async (config: Config, dayNum: number, part: 1 | 2) => {
  console.log(`\nPart ${part}:`)
  const dayData =
    part === 1 ? config.days[dayNum - 1].part1 : config.days[dayNum - 1].part2

  if (dayData.solved) {
    console.log(kleur.green(`Already solved!`))
    return true
  }

  if (dayData.attempts.includes(dayData.result)) {
    console.log(kleur.yellow("You already tried this solution, skipping."))
    return false
  }

  if (dayData.result === null) {
    console.log(kleur.yellow(`Solution is undefined, skipping.`))
    return false
  }

  if (/\n/.test(dayData.result)) {
    console.log(
      kleur.yellow(stripIndent`
      Solution to part ${part} is a multiline string,
      and should probably be interpreted before sending.
    `),
    )
    console.log()

    const { choice, replacement } = await asciiPrompt(part)

    switch (choice) {
      case AsciiOptions.INTERPRETED:
        if (replacement !== undefined && replacement !== "") {
          dayData.result = replacement
        } else {
          console.log(kleur.yellow(`Solution is undefined, skipping.`))
          return false
        }
        break
      case AsciiOptions.AS_IS:
        break
      case AsciiOptions.CANCEL: {
        console.log(kleur.yellow(`Skipping.`))
        return false
      }
    }
  }

  const status = await sendSolution(config.year, dayNum, part, dayData.result)

  if (status === Status["SOLVED"]) {
    config.days[dayNum - 1][part === 1 ? "part1" : "part2"].solved = true
    saveConfig(config)
    updateReadme()
    return true
  }

  if (status === Status["WRONG"]) {
    config.days[dayNum - 1][part === 1 ? "part1" : "part2"].attempts.push(
      dayData.result,
    )
    saveConfig(config)
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
  const dayReadmePath = path.join(toDir, "README.md")

  if (!fs.existsSync(fromDir)) {
    console.log(kleur.red("Template folder does not exist!"))
  }

  if (!fs.existsSync(toDir)) {
    console.log("Creating from template...")
    copy(fromDir, toDir)

    fs.writeFileSync(inputPath, "")

    if (!fs.existsSync(dayReadmePath)) {
      fs.writeFileSync(dayReadmePath, readmeDayMD(config.year, dayNum))
    }
  }

  getInput(config.year, dayNum, inputPath)

  const files = getAllFiles("src")

  if (config.language === "ts") {
    buildSource(files)
  }

  runSolution(dayNum, indexFile)

  const reload = (file: string) => {
    if (![".js", ".ts", ".mjs"].includes(path.parse(file).ext)) {
      return
    }

    console.clear()

    if (config.language === "ts") {
      console.log("Building...\n")
      buildSource(file)
    }

    runSolution(dayNum, indexFile)

    showInfo()

    process.stdout.write(kleur.cyan("?") + kleur.gray("  › "))
  }

  chokidar
    .watch("src", { ignoreInitial: true })
    .on("add", reload)
    .on("change", reload)

  const listenToInput = async () => {
    showInfo()

    const { command } = await commandPrompt()

    const config = readConfig()

    switch (command.toLowerCase()) {
      case "fetch":
      case "f":
        getInput(config.year, dayNum, inputPath)
        break
      case "send":
      case "s":
        const solved = await send(config, dayNum, 1)

        if (solved) {
          await send(config, dayNum, 2)
        }
        break
      case "clear":
      case "c":
        console.clear()
        break
      default:
        console.log("Command not supported")
        break
    }
    listenToInput()
  }

  listenToInput()
}

export default dev
