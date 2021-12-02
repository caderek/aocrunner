import { spawnSync } from "child_process"
import kleur from "kleur"

const runSolution = (day: number, path: string) => {
  console.log(kleur.blue(`\n-- Day ${day} `.padEnd(40, "-") + "\n"))
  spawnSync("node", [path], {
    stdio: "inherit",
    shell: true,
  })
  console.log(kleur.blue("\n".padEnd(40, "-")))
}

export default runSolution
