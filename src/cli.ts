#!/usr/bin/env node
import init from "./actions/init.js"
import dev from "./actions/dev.js"
import build from "./actions/build.js"
import updateReadme from "./actions/updateReadMe.js"
import dotenv from "dotenv"
import version from "./version.js"

dotenv.config()

const commandPos = process.argv.findIndex((arg) =>
  ["init", "day", "build", "update:readme"].includes(arg),
)

if (commandPos === -1) {
  console.log("Command not supported")
  process.exit(1)
}

const [command, ...args] = process.argv.slice(commandPos)

switch (String(command || "").toLowerCase()) {
  case "-v": {
    console.log(version)
    break
  }
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
  case "update:readme": {
    updateReadme()
    break;
  }
  default: {
    console.log("Command not supported")
    process.exit(1)
  }
}
