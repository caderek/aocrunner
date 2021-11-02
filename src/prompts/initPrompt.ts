import prompts from "prompts"
import { execSync } from "child_process"

const initPrompt = () => {
  const firstYear = 2015
  const currentYear = new Date().getFullYear()

  const years = new Array(currentYear - firstYear + 1)
    .fill(firstYear)
    .map((val, i) => val + i)
    .reverse()

  let author = ""

  try {
    author = execSync("git config user.name").toString().trim()
  } catch {}

  return prompts([
    {
      type: "select",
      name: "year",
      message: "Pick a year",
      choices: years.map((year) => ({ title: year, value: year })),
      initial: 0,
    },
    {
      type: "select",
      name: "language",
      message: "Pick a language",
      choices: [
        { title: "JavaScript", value: "js" },
        { title: "TypeScript", value: "ts" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "packageManager",
      message: "Which package manager do you use?",
      choices: [
        { title: "NPM", value: "npm" },
        { title: "Yarn", value: "yarn" },
        { title: "pnpm", value: "pnpm" },
      ],
      initial: 0,
    },
    {
      type: "text",
      name: "author",
      message: `Author`,
      initial: author,
    },
    {
      type: "toggle",
      name: "semicolons",
      message: "Semicolons?",
      initial: true,
      active: "yes",
      inactive: "no",
    },
  ])
}

export default initPrompt
