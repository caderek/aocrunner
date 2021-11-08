import fs from "fs"
import type { Config } from "../types/common"

const readConfig = (): Config => {
  return JSON.parse(fs.readFileSync(".aocrunner.json").toString())
}

const saveConfig = (config: Config) => {
  const data = JSON.stringify(config, null, 2)
  fs.writeFileSync(".aocrunner.json", data)
}

export { saveConfig, readConfig }
