require("dotenv").config()

import fetch from "node-fetch"
import { JSDOM } from "jsdom"
import { writeFileSync, existsSync, statSync } from "fs"

const strToNum = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
}

let canSubmit = true
let delayStart = 0
let delayAmount = 0

const handleErrors = (e: Error) => {
  if (e.message === "400" || e.message === "500") {
    console.log(
      "INVALID SESSION KEY\nPlease make sure that the session key in the .env file is correct.",
    )
  } else if (e.message.startsWith("5")) {
    console.log("SERVER ERROR")
  } else if (e.message === "404") {
    console.log("CHALLENGE NOT YET AVAILABLE")
  } else {
    console.log(
      "UNEXPECTED ERROR\nPlease check your internet connection.\n\nIf you think it's a bug, create an issue on github.\nHere are some details to include:\n",
    )
    console.log(e)
  }
}

const getInput = async (year: number, day: number, path: string) => {
  if (existsSync(path) && statSync(path).size > 0) {
    console.log(`INPUT FOR AOC ${year} DAY ${day} ALREADY FETCHED`)
    return
  }

  fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status))
      }

      return res.text()
    })
    .then((body) => {
      writeFileSync(path, body.replace(/\n$/, ""))
      console.log(`INPUT FOR AOC ${year} DAY ${day} SAVED!`)
    })
    .catch(handleErrors)
}

const sendSolution = (
  year: number,
  day: number,
  part: 1 | 2,
  solution: number | string,
) => {
  if (!canSubmit) {
    console.log("you have to wait!")
    return
  }

  fetch(`https://adventofcode.com/${year}/day/${day}/answer`, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `level=${part}&answer=${solution}`,
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status))
      }

      return res.text()
    })
    .then((body) => {
      const $main = new JSDOM(body).window.document.querySelector("main")

      const info =
        $main !== null
          ? ($main.textContent as string).replace(/\[.*\]/, "").trim()
          : "Can't find the main element"

      if (info.includes("That's the right answer")) {
        console.log(`\nStatus: PART ${part} SOLVED!`)
      } else if (info.includes("That's not the right answer")) {
        console.log("\nStatus: WRONG ANSWER")
        console.log(info)
      } else if (info.includes("You gave an answer too recently")) {
        console.log("\nStatus: TO SOON")
      } else if (
        info.includes("You don't seem to be solving the right level")
      ) {
        console.log("\nStatus: ALREADY COMPLETED or LOCKED")
      } else {
        console.log("\nStatus: UNKNOWN RESPONSE\n")
        console.log(info)
      }

      const waitStr = info.match(
        /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/,
      )
      const waitNum = info.match(/\d+\s*(s|m|h|d)/g)

      if (waitStr !== null || waitNum !== null) {
        const waitTime = {
          s: 0,
          m: 0,
          h: 0,
          d: 0,
        }

        if (waitStr !== null) {
          const [_, time, unit] = waitStr
          waitTime[unit[0]] = strToNum[time]
        } else if (waitNum !== null) {
          waitNum.forEach((x) => {
            waitTime[x.slice(-1)] = Number(x.slice(0, -1))
          })
        }

        canSubmit = false
        delayStart = Date.now()
        delayAmount =
          (waitTime.d * 24 * 60 * 60 +
            waitTime.h * 60 * 60 +
            waitTime.m * 60 +
            waitTime.s) *
          1000

        const delayStr = `${waitTime.d > 0 ? `${waitTime.d}d ` : ""}${
          waitTime.h > 0 ? `${waitTime.h}h ` : ""
        }${waitTime.m > 0 ? `${waitTime.m}m ` : ""}${
          waitTime.s > 0 ? `${waitTime.s}s` : ""
        }`

        console.log(`Next request possible in: ${delayStr}`)
      }
    })
    .catch(handleErrors)
}

export { getInput, sendSolution }
