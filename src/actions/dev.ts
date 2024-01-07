import fs from "fs"
import path from "path"
import { stripIndent } from "common-tags"
import chokidar from "chokidar"
import kleur from "kleur"
import getAllFiles from "../utils/getAllFiles.js"
import buildSource from "./processes/buildSource.js"
import runSolution from "./processes/runSolution.js"
import getLatestVersion from "./processes/getLatestVersion.js"
import copy from "../io/copy.js"
import save from "../io/save.js"
import { aocrunnerDaysJSON } from "../configs/runnerJSON.js"
import { readConfig, saveConfig } from "../io/config.js"
import { getInput, getPuzzleInfo, sendSolution, Status } from "../io/api.js"
import readmeYearMD from "../configs/readmeYearMD.js"
import readmeDayMD from "../configs/readmeDayMD.js"
import asciiPrompt, { AsciiOptions } from "../prompts/asciiPrompt.js"
import commandPrompt from "../prompts/commandPrompt.js"
import type { Config } from "../types/common"
import updateReadmes from "./updateReadMe.js"
import version from "../version.js"

let latestVersion: string | null = null
getLatestVersion().then((v) => {
  latestVersion = v
})

const boldMagenta = kleur.bold().magenta

const showFullInfo = () => {
  const updateInfo =
    latestVersion === null
      ? ""
      : latestVersion !== version
      ? `(update available: v${latestVersion})`
      : "(latest)"

  console.log()
  console.log(stripIndent`
    AoC Runner v${version} ${updateInfo}

    Type ${boldMagenta("fetch")} or ${boldMagenta("f")} - to fetch the input
    Type ${boldMagenta("send")}  or ${boldMagenta("s")} - to send the solutions
    Type ${boldMagenta("help")}  or ${boldMagenta("h")} - to show all commands
    Type ${boldMagenta("clear")} or ${boldMagenta("c")} - to clear the console
    Type ${boldMagenta("quit")}  or ${boldMagenta("q")} - to close the runner
  `)
  console.log()
}

const showInfo = () => {
  console.log()
  console.log(stripIndent`
    Type: ${boldMagenta("f")} - fetch input, ${boldMagenta(
    "s",
  )} - send solutions, ${boldMagenta("h")} - help,  ${boldMagenta("q")} - quit
  `)

  if (latestVersion !== null && latestVersion !== version) {
    console.log()
    console.log(kleur.green(`Update available (v${latestVersion})!`))

    console.log(
      `To update, close the runner and run`,
      kleur.bold().green("npm i aocrunner"),
    )
  }

  console.log()
}

const send = async (config: Config, yearNum: number, dayNum: number, part: 1 | 2) => {
  const yearConfig = config.years.find(y => y.year == yearNum)!;
  console.log(`\nPart ${part}:`)
  const dayData =
    part === 1 ? yearConfig.days[dayNum - 1].part1 : yearConfig.days[dayNum - 1].part2

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

  const status = await sendSolution(yearConfig.year, dayNum, part, dayData.result)

  if (status === Status["SOLVED"]) {
    yearConfig.days[dayNum - 1][part === 1 ? "part1" : "part2"].solved = true
    saveConfig(config)
    updateReadmes(yearConfig.year.toString(), dayNum)
    return true
  }

  if (status === Status["WRONG"]) {
    yearConfig.days[dayNum - 1][part === 1 ? "part1" : "part2"].attempts.push(
      dayData.result,
    )
    saveConfig(config)
  }

  return false
}

const dev = async (yearRaw: string | undefined, dayRaw: string | undefined) => {
  const year = yearRaw && (yearRaw.match(/\d{4}/) ?? [])[0]
  const day = dayRaw && (dayRaw.match(/\d+/) ?? [])[0]

  if (year === undefined) {
    console.log(kleur.red("No year specified."))
    process.exit(1)
  }
  if (day === undefined) {
    console.log(kleur.red("No day specified."))
    process.exit(1)
  }

  const config = readConfig();
  const yearNum = Number(year);
  const dayNum = Number(day);

  let configYear = config.years.find(y => y.year == yearNum);

  if (configYear == undefined) {
	const yearDir = path.join("src", year);
	fs.mkdirSync(yearDir, { recursive: true })
    config.years.push(configYear = { year: yearNum, days: aocrunnerDaysJSON() });
	config.years.sort((a, b) => a.year - b.year);
	saveConfig(config);
	save(yearDir, "README.md", readmeYearMD(config.language, config.years.find(y => y.year === Number(year))!))
  }

  if (yearNum < 2015 || yearNum > new Date().getFullYear()) {
    console.log(kleur.red(`Wrong year - choose year between 2015 and ${new Date().getFullYear()}.`))
    process.exit(1)
  }
  if (dayNum < 1 || dayNum > 25) {
    console.log(kleur.red("Wrong day - choose day between 1 and 25."))
    process.exit(1)
  }

  const dayDir = `day${String(dayNum).padStart(2, "0")}`
  const fromDir = path.join("src", "template")
  const yearDir = path.join("src", yearRaw!)
  
  const toDir = path.join(yearDir, dayDir)
  const indexFile = path.join(
    config.language === "ts" ? "dist" : "src",
	yearRaw!,
    dayDir,
    "index.js",
  )
  const inputPath = path.join(toDir, "input.txt")
  const dayReadmePath = path.join(toDir, "README.md")

  if (!fs.existsSync(fromDir)) {
    console.log(kleur.red("Template folder does not exist!"))
  }

  const toExists = fs.existsSync(toDir);
  if (!toExists) {
    console.log("Creating from template...")
    copy(fromDir, toDir)

	const [title, testData] = await getPuzzleInfo(yearNum, dayNum, inputPath);

	if ( config.language === "ts" ) {
      const dayIndexFile = path.join(toDir, "index.ts");
      if (fs.existsSync(toDir)) {
        let dayIndexContent = fs.readFileSync(dayIndexFile).toString();
        if ( testData != null ) {
          const regex = /([ \t]*)\{testData\}/;
          const match = dayIndexContent.match(regex);
          if (match) {
			  const indent = match[1];
              const testDataIndented = testData.split("\n").filter( l => l != "" ).map(line => `${indent}${line}`).join("\n");
			  dayIndexContent = dayIndexContent.replace(regex, testDataIndented);
			  fs.writeFileSync(dayIndexFile, dayIndexContent);
          }
        }
      }
	}
	
    fs.writeFileSync(inputPath, "")

    if (!fs.existsSync(dayReadmePath)) {
	  if ( title != null ) {
	    configYear.days[dayNum - 1].title = title;
		saveConfig(config);
	  }
      fs.writeFileSync(dayReadmePath, readmeDayMD(configYear.year, dayNum, title))
    }
  }

  getInput(configYear.year, dayNum, inputPath)

  if ( toExists ) {
    const files = getAllFiles(path.join("src", year))
    if (config.language === "ts") {
      buildSource(year, files)
    }
    runSolution(dayNum, indexFile)
  }	

  const reload = (file: string) => {
    if (![".js", ".ts", ".mjs"].includes(path.parse(file).ext)) {
      return
    }

    console.clear()

    if (config.language === "ts") {
      buildSource(year, file)
    }

    runSolution(dayNum, indexFile)

    showInfo()

    process.stdout.write(kleur.cyan("?") + kleur.gray("  › "))
  }

  chokidar
    .watch([path.join("src", "utils"), path.join("src", year)], { ignoreInitial: true })
    .on("add", reload)
    .on("change", reload)

  const listenToInput = async (year: string) => {
    showInfo()

    const { command } = await commandPrompt()

    const config = readConfig();
	const yearNum = Number(year)
	
    switch (command.toLowerCase()) {
      case "fetch":
      case "f":
        getInput(yearNum, dayNum, inputPath)
        break
      case "send":
      case "s":
        const solved = await send(config, yearNum, dayNum, 1)

        if (solved) {
          await send(config, yearNum, dayNum, 2)
        }
        break
      case "help":
      case "h":
        showFullInfo()
        break
      case "clear":
      case "c":
        console.clear()
        break
      case "quit":
      case "q":
        process.exit()
      default:
        console.log("Command not supported")
        break
    }
    listenToInput(year)
  }

  listenToInput(year)
}

export default dev
