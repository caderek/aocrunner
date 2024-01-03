#!/usr/bin/env node
import init from "./actions/init.js"
import dev from "./actions/dev.js"
import build from "./actions/build.js"
import kleur from "kleur"
import updateReadmes from "./actions/updateReadMe.js"
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
	if ( args.length < 2 ) {
		console.log(kleur.red("No must specify both a year and a day to start."))
		break;
	}
    dev(args[0], args[1])
    break
  }
  case "build": {
    build(args[0])
    break
  }
  case "update:readme": {
    updateReadmes(args[0])
    break;
  }
  default: {
    console.log("Command not supported")
    process.exit(1)
  }
}
