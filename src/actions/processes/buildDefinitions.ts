import { spawnSync } from "child_process"
import path from "path"
import kleur from "kleur"

const buildDefinitions = (year: string) => {
  console.log("\nBuilding definition files...\n")
  const t0 = process.hrtime.bigint()
  spawnSync("tsc", ["--emitDeclarationOnly", "--outDir", path.join(year, "dist")], {
    stdio: "inherit",
    shell: true,
  })
  const t1 = process.hrtime.bigint()
  const time = (Number(t1 - t0) / 1e6).toFixed(0)

  console.log("⚡", kleur.green(`Done in ${time}ms`))
}

export default buildDefinitions
