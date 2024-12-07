import prompts from "prompts"
import { execSync } from "child_process"
import kleur from "kleur"
import { PackageConfigDefaults } from "../types/common.js"

const onCancel = () => {
  console.log(kleur.yellow("Aborting!"))
  process.exit(1)
}

const initPrompt = () => {
  const firstYear = 2015
  const currentYear = new Date().getFullYear()

  const years = new Array(currentYear - firstYear + 1)
    .fill(firstYear)
    .map((val, i) => val + i)
    .reverse()

  // currently, 18 is oldest supported version, 23 is most up-todate, 24 to be released in Q2 2025
  const nodeVersions = new Array(24 + 1 - 18)
    .fill(18)
    .map((val, i) => val + i)
    .reverse()
  const defaultNodeVersion: number = +process.version.replace(
    /^v(\d+)\..*$/,
    "$1",
  )

  let author = ""

  try {
    author = execSync("git config user.name").toString().trim()
  } catch {}

  return prompts(
    [
      {
        type: "select",
        name: "year",
        message: "Year",
        choices: years.map((year) => ({ title: year, value: year })),
        initial: 0,
      },
      {
        type: "text",
        name: "name",
        message: "Directory name",
        initial: (prev) => `aoc${prev}`,
      },
      {
        type: "select",
        name: "language",
        message: "Language",
        choices: [
          { title: "JavaScript", value: "js" },
          { title: "TypeScript", value: "ts" },
        ],
        initial: 0,
      },
      {
        type: (prev) => (prev === "ts" ? "toggle" : null),
        name: "strict",
        message: "Strict mode",
        initial: true,
        active: "yes",
        inactive: "no",
      },
      {
        type: "toggle",
        name: "semicolons",
        message: "Semicolons",
        initial: true,
        active: "yes",
        inactive: "no",
      },
      {
        type: "number",
        name: "tabWidth",
        message: "Tab width (adjust later in package.json and prettierrc.json)",
        initial: PackageConfigDefaults.tabWidth,
        min: PackageConfigDefaults.tabWidth,
        max: 8,
      },
      {
        type: "text",
        name: "author",
        message: `Author`,
        initial: author,
      },
      {
        type: "select",
        name: "packageManager",
        message: "Package manager",
        choices: [
          { title: "NPM", value: "npm" },
          { title: "Yarn", value: "yarn" },
          { title: "pnpm", value: "pnpm" },
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "nodeVersion",
        message: "NodeJS Version to use",
        hint: "hint",
        choices: nodeVersions.map((value) => ({ title: value, value })),
        initial: Math.max(0, nodeVersions.indexOf(defaultNodeVersion)),
      },
    ],
    { onCancel },
  )
}

export default initPrompt
