import fs from "fs"
import path from "path"
import type { Config } from "../types/common"

const readConfig = (): Config => {
  return JSON.parse(fs.readFileSync(path.join("src", ".aocrunner.json")).toString())
}

const saveConfig = (config: Config) => {
  const data = JSON.stringify(config, null, 2);
  fs.writeFileSync(path.join("src", ".aocrunner.json"), data)
}

export { saveConfig, readConfig }
