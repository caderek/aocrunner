import fs from "fs"
import kleur from "kleur"
import { stripIndent } from "common-tags"
import { saveConfig, readConfig } from "./io/config.js"
import toFixed from "./utils/toFixed.js"
import getDayData from "./utils/getDayData.js"

type Tests = {
  name?: string
  input: string
  expected: string | number | bigint | void
}[]

type Solution = (input: string) => string | number | bigint | void

type Solutions = {
  part1?: {
    solution: Solution
    tests?: Tests
  }
  part2?: {
    solution: Solution
    tests?: Tests
  }
  trimTestInputs?: boolean
  onlyTests?: boolean
}

const runTests = async (
  tests: Tests,
  solution: Solution,
  part: 1 | 2,
  trimTestInputs = true,
) => {
  for (let i = 0; i < tests.length; i++) {
    const { name, input, expected } = tests[i]

    const data = trimTestInputs ? stripIndent(input) : input

    const result = await solution(data)

    const testName = `Part ${part}, test ${i + 1}${name ? `, ${name}` : ""}`

    if (result === expected) {
      console.log(kleur.green(`${testName} - passed`))
    } else {
      console.log(kleur.red(`${testName} - failed`))
      console.log(`\nResult:`)
      console.dir(result)
      console.log(`\nExpected:`)
      console.dir(expected)
      console.log()
    }
  }
}

const runSolution = async (solution: Solution, input: string, part: 1 | 2) => {
  const t0 = process.hrtime.bigint()
  const result = await solution(input)
  const t1 = process.hrtime.bigint()
  const time = Number(t1 - t0) / 1e6

  if (!["string", "number", "bigint", "undefined"].includes(typeof result)) {
    console.log(
      kleur.yellow(
        `Warning - the result type of part ${part} should be a string, a number or a bigint, got:`,
      ),
      kleur.red(typeof result),
    )
  }

  console.log(`\nPart ${part} (in ${toFixed(time)}ms):`)

  if (typeof result === "string" && /\n/.test(result)) {
    console.log(result)
  } else {
    console.dir(result)
  }

  return { result, time }
}

const runAsync = async (
  solutions: Solutions,
  inputFile: string,
  day: number,
) => {
  const config = readConfig()

  if (solutions?.part1?.tests) {
    await runTests(
      solutions.part1.tests,
      solutions.part1.solution,
      1,
      solutions.trimTestInputs,
    )
  }

  if (solutions?.part2?.tests) {
    await runTests(
      solutions.part2.tests,
      solutions.part2.solution,
      2,
      solutions.trimTestInputs,
    )
  }

  if (solutions.onlyTests) {
    return
  }

  const input = fs.readFileSync(inputFile).toString()

  let output1
  let output2
  let totalTime = 0

  if (solutions.part1) {
    output1 = await runSolution(solutions.part1.solution, input, 1)
    totalTime += output1.time
  }

  if (solutions.part2) {
    output2 = await runSolution(solutions.part2.solution, input, 2)
    totalTime += output2.time
  }

  console.log(`\nTotal time: ${toFixed(totalTime)}ms`)

  config.days[day - 1].part1.result =
    output1?.result === undefined ? null : String(output1.result)

  config.days[day - 1].part1.time =
    output1?.result === undefined ? null : output1.time

  config.days[day - 1].part2.result =
    output2?.result === undefined ? null : String(output2.result)

  config.days[day - 1].part2.time =
    output2?.result === undefined ? null : output2.time

  saveConfig(config)
}

const run = (solutions: Solutions, customInputFile?: string) => {
  let day = null
  let inputFile = null

  if (customInputFile) {
    const dayName = (customInputFile.match(/day\d\d/) || [])[0]
    inputFile = customInputFile
    day = dayName ? Number(dayName.slice(-2)) : null
  } else {
    const dayData = getDayData()
    day = dayData.day
    inputFile = dayData.inputFile
  }

  if (inputFile === null) {
    console.log(
      kleur.red(stripIndent`
        Couldn't detect the day directory!

        Please make sure that the day folder is named "dayXX",
        where each X means number from 0 to 9.
      `),
    )
    return
  }

  if (day === null) {
    console.log(
      kleur.red(stripIndent`
        Couldn't detect the day number!

        Make sure that your directory or file name contains the day number
        inf format "dayXX", where each X means number from 0 to 9.
      `),
    )
    return
  }

  if (!fs.existsSync(inputFile)) {
    console.log(
      kleur.red(stripIndent`
        There is no "input.txt" file in the solution directory!
        
        Please add the file or specify custom file location
        via the second argument of the \`run\` function.
      `),
    )
    return
  }

  runAsync(solutions, inputFile, day)
}

export default run
