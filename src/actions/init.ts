import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import kleur from "kleur"
import initPrompt from "../prompts/initPrompt.js"
import save from "../io/save.js"
import copy from "../io/copy.js"
import packageJSON from "../configs/packageJSON.js"
import tsconfigJSON from "../configs/tsconfigJSON.js"
import prettierJSON from "../configs/prettierJSON.js"
import gitignoreTXT from "../configs/gitignoreTXT.js"
import prettierignoreTXT from "../configs/prettierignoreTXT.js"
import runnerJSON from "../configs/runnerJSON.js"
import envTXT from "../configs/envTXT.js"
import readmeMD from "../configs/readmeMD.js"

import type { Setup } from "../types/common"

const dirname = path.dirname(fileURLToPath(import.meta.url))

const init = async () => {
  console.log("Initializing")

  const setup: Setup = await initPrompt()

  const installCmd =
    setup.packageManager === "npm"
      ? "npm i"
      : setup.packageManager === "yarn"
      ? "yarn"
      : "pnpm install"

  const formatCmd =
    setup.packageManager === "npm"
      ? "npm run format"
      : setup.packageManager === "yarn"
      ? "yarn format"
      : "pnpm format"

  const startCmd =
    setup.packageManager === "npm"
      ? "npm start"
      : setup.packageManager === "yarn"
      ? "yarn start"
      : "pnpm start"

  const dir = setup.name
  const srcDir = path.join(dir, "src")

  if (fs.existsSync(dir)) {
    console.log("Project already exists. Aborted.")
    process.exit(1)
  }

  fs.mkdirSync(srcDir, { recursive: true })

  const config = runnerJSON(setup)

  save(dir, "package.json", packageJSON(setup))
  save(dir, ".prettierrc.json", prettierJSON(setup))
  save(dir, ".gitignore", gitignoreTXT(setup))
  save(dir, ".prettierignore", prettierignoreTXT(setup))
  save(dir, ".aocrunner.json", config)
  save(dir, ".env", envTXT)
  save(dir, "README.md", readmeMD(setup, startCmd, installCmd, config))

  if (setup.language === "ts") {
    save(dir, "tsconfig.json", tsconfigJSON(setup))
  }

  const templatesDir = path.resolve(
    dirname,
    "..",
    "..",
    "templates",
    setup.language,
  )

  copy(templatesDir, srcDir)

  console.log("\nInstalling dependencies...\n")
  execSync(installCmd, { cwd: dir, stdio: "inherit" })

  console.log("\nFormatting the source files...\n")
  execSync(formatCmd, { cwd: dir, stdio: "inherit" })

  console.log(
    kleur.green("\nDone!\n\n") +
      `Go to the project's directory (cd ${dir}) and:\n` +
      "  - add your AoC session key to the .env file (optional)\n" +
      "  - tweak your template files in src/template (optional)\n" +
      `  - start solving the first puzzle: ${startCmd} 1\n\n` +
      "🎄🎄 GOOD LUCK! 🎄🎄",
  )
}

export default init
