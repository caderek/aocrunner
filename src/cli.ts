#!/usr/bin/env node
import init from "./actions/init.js"
import dev from "./actions/dev.js"
import build from "./actions/build.js"
import dotenv from "dotenv"

dotenv.config()

let all = process.argv.slice(2).map((v) => v.trim())

const [command, ...args] = all

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
