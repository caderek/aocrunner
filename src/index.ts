import fs from "fs"
import path from "path"
import kleur from "kleur"
import getCallerFile from "get-caller-file"
import { stripIndent } from "common-tags"
import type { Config } from "./types/common"

type Tests = { input: string; expected: any }[]
type Solution = (input: string) => any

type Solutions = {
  part1?: {
    solution: Solution
    tests?: Tests
  }
  part2?: {
    solution: Solution
    tests?: Tests
  }
}

const readConfig = (): Config => {
  return JSON.parse(fs.readFileSync(".aocrunner.json").toString())
}

const saveConfig = (config: Config) => {
  const data = JSON.stringify(config, null, 2)
  fs.writeFileSync(".aocrunner.json", data)
}

const runTests = async (tests: Tests, solution: Solution, part: number) => {
  for (let i = 0; i < tests.length; i++) {
    const { input, expected } = tests[i]
    const result = await solution(input)

    if (result === expected) {
      console.log(kleur.green(`Part ${part}, test ${i + 1} - passed`))
    } else {
      console.log(kleur.red(`Part ${part}, test ${i + 1} - failed`))
      console.log(`Result:`)
      console.dir(result)
      console.log(`Expected:`)
      console.dir(expected)
    }
  }
}

const runSolution = async (solution: Solution, input: string) => {
  const t0 = process.hrtime.bigint()
  const result = await solution(input)
  const t1 = process.hrtime.bigint()
  const time = (Number(t1 - t0) / 1e6).toFixed(2)

  console.log(`Part 1 (in ${time}ms):`)
  console.dir(result)

  return result
}

const runAsync = async (
  solutions: Solutions,
  inputFile: string,
  day: number,
) => {
  const config = readConfig()

  if (solutions?.part1?.tests) {
    await runTests(solutions.part1.tests, solutions.part1.solution, 1)
  }

  if (solutions?.part2?.tests) {
    await runTests(solutions.part2.tests, solutions.part2.solution, 2)
  }

  const input = fs.readFileSync(inputFile).toString()

  let result1
  let result2

  if (solutions.part1) {
    result1 = await runSolution(solutions.part1.solution, input)
  }

  if (solutions.part2) {
    result2 = await runSolution(solutions.part2.solution, input)
  }

  if (result1 !== undefined) {
    config.days[day - 1].part1.result = result1
  }

  if (result2 !== undefined) {
    config.days[day - 1].part2.result = result2
  }

  saveConfig(config)
}

const run = (solutions: Solutions, inputFile?: string) => {
  const callerFile = getCallerFile().replace(/(file:\\\\)|(file:\/\/)/, "")
  const dir = path.parse(callerFile).dir.split(path.sep)
  const day = Number(
    [...dir]
      .reverse()
      .find((x) => /day\d\d/.test(x))
      ?.slice(-2),
  )

  if (inputFile === undefined) {
    const lastDist = dir.lastIndexOf("dist")

    if (lastDist !== -1) {
      dir[lastDist] = "src"
    }

    inputFile = path.join(dir.join(path.sep), "input.txt")
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
