#!/usr/bin/env node
import init from "./actions/init.js"
import dev from "./actions/dev.js"
import build from "./actions/build.js"
import dotenv from "dotenv"

dotenv.config()

const [command, ...args] = process.argv
  .filter((arg) => !["npm", "pnpm", "yarn", "npx", "pnpx", "run"].includes(arg))
  .slice(1)
  .map((v) => v.trim())

switch (String(command || "").toLowerCase()) {
  case "init": {
    init()
    break
  }
  case "day": {
    dev(args[0])
    break
  }
  case "build": {
    build()
    break
  }
  default: {
    console.log("Command not supported")
    break
  }
}
