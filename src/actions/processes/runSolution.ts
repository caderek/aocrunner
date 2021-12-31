import { spawn } from "child_process"
import kleur from "kleur"

const runSolution = async (day: number, path: string) => {
  return new Promise((resolve) => {
    console.log(kleur.blue(`\n-- Day ${day} `.padEnd(40, "-") + "\n"))
    const child = spawn("node", [path], {
      stdio: "inherit",
      shell: true,
    })
    console.log(kleur.blue("\n".padEnd(40, "-")))

    const stop = () => {
      child.kill(9)
    }
    process.on("SIGINT", stop)

    child.on("exit", (code) => {
      resolve(code)
      process.off("SIGINT", stop)
    })
  })
}

export default runSolution
