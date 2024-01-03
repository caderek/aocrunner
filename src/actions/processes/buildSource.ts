import { spawnSync } from "child_process"
import path from "path"

const buildSource = (year: string, input: string | string[], sourcemap: boolean = true) => {
  const files = Array.isArray(input) ? input : [input]
  const outDir = Array.isArray(input)
    ? path.join(year, "dist")
    : path.parse(input).dir.replace(/^src/, "dist")

  console.log("Transpiling...\n")

  spawnSync(
    "npx",
    [
      "esbuild",
      ...files,
      "--format=esm",
      `--outdir=${outDir}`,
      "--platform=node",
      "--target=node16",
      ...(sourcemap ? ["--sourcemap"] : []),
    ],
    { stdio: "inherit", shell: true },
  )
}

export default buildSource
