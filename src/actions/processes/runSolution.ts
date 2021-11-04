import { spawnSync } from "child_process"
import kleur from "kleur"

const runSolution = (day: number, path: string) => {
  console.log(kleur.blue(`\n= Day ${day} =`.padEnd(40, "=") + "\n"))
  spawnSync("node", [path], {
    stdio: "inherit",
  })
  console.log(kleur.blue("\n" + "=".repeat(39)))
}

export default runSolution
