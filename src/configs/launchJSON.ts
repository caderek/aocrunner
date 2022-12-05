import type { Setup } from "../types/common"

const launchJSON = ({ packageManager }: Setup) => {
  return {
    "configurations": [
      {
        "name": "Advent of Code Runner: Start",
        "type": "node",
        "request": "launch",
        "trace": "true",
        "runtimeExecutable": packageManager,
        "runtimeArgs": ["start", "${input:day}"],
        "console": "integratedTerminal"
      }
    ],
    "inputs": [
      {
        "id": "day",
        "type": "promptString",
        "description": "Enter the day number",
        "default": "1"
      }
    ]
  }
  
}

export default launchJSON
