import { spawnSync } from "child_process"
import kleur from "kleur"

const buildDefinitions = () => {
  console.log("\nBuilding definition files...\n")
  const t0 = process.hrtime.bigint()
  spawnSync("tsc", ["--emitDeclarationOnly", "--outDir", "dist"], {
    stdio: "inherit",
    shell: true,
  })
  const t1 = process.hrtime.bigint()
  const time = (Number(t1 - t0) / 1e6).toFixed(0)

  console.log("⚡", kleur.green(`Done in ${time}ms`))
}

export default buildDefinitions
