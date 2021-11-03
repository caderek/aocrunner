import { stripIndent } from "common-tags"
import chokidar from "chokidar"
import kleur from "kleur"
import getAllFiles from "../utils/getAllFiles"
import buildSource from "./processes/buildSource"

const dev = (dayRaw: string | undefined) => {
  const day = dayRaw && (dayRaw.match(/\d+/) ?? [])[0]

  if (day === undefined) {
    console.log(kleur.red("No day specified."))
    process.exit(1)
  }

  const dayNum = Number(day)

  if (dayNum < 1 || dayNum > 25) {
    console.log(kleur.red("Wrong day - chose day between 1 and 25."))
    process.exit(1)
  }

  const files = getAllFiles("src")

  buildSource(files)

  console.log("")
  console.log(stripIndent`
    Type:
      ${kleur.magenta("fetch")} or ${kleur.magenta("f")} - to fetch the input
      ${kleur.magenta("send")}  or ${kleur.magenta("s")} - to send the solution
  `)

  chokidar
    .watch("src", { ignoreInitial: true })
    .on("add", (path) => buildSource(path))
    .on("change", (path) => buildSource(path))

  process.stdin.on("data", function (chunk) {
    const data = chunk.toString()

    if (/f(etch){0,1}\n/.test(data)) {
      console.log("Fetching!")
    } else if (/s(end){0,1}\n/.test(data)) {
      console.log("Send!")
    }
  })
}

export default dev
