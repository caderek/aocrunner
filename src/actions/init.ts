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

import type { Setup } from "../types/common"

const dirname = path.dirname(fileURLToPath(import.meta.url))

const init = async () => {
  console.log("Initializing")

  const setup: Setup = await initPrompt()

  const dir = `aoc${setup.year}`
  const srcDir = path.join(dir, "src")

  if (fs.existsSync(dir)) {
    console.log("Project already exists. Aborted.")
    process.exit(1)
  }

  fs.mkdirSync(srcDir, { recursive: true })

  save(dir, "package.json", packageJSON(setup))
  save(dir, ".prettierrc.json", prettierJSON(setup))
  save(dir, ".gitignore", gitignoreTXT(setup))
  save(dir, ".prettierignore", prettierignoreTXT(setup))

  if (setup.language === "ts") {
    save(dir, "tsconfig.json", tsconfigJSON)
  }

  const templatesDir = path.resolve(
    dirname,
    "..",
    "..",
    "templates",
    setup.language,
  )

  copy(templatesDir, srcDir)

  const installCommand =
    setup.packageManager === "npm"
      ? "npm i"
      : setup.packageManager === "yarn"
      ? "yarn"
      : "pnpm install"

  console.log("\nInstalling dependencies...\n")

  execSync(installCommand, { cwd: dir, stdio: "inherit" })

  console.log(kleur.green("Done!"))
}

export default init
