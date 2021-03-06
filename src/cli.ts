#!/usr/bin/env node
import init from "./actions/init.js"
import dev from "./actions/dev.js"
import build from "./actions/build.js"
import dotenv from "dotenv"

dotenv.config()

const commandPos = process.argv.findIndex((arg) =>
  ["init", "day", "build"].includes(arg),
)

if (commandPos === -1) {
  console.log("Command not supported")
  process.exit(1)
}

const [command, ...args] = process.argv.slice(commandPos)

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
    process.exit(1)
    break
  }
}
