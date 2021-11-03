import { spawnSync } from "child_process"
import path from "path"

const buildSource = (input: string | string[]) => {
  const files = Array.isArray(input) ? input : [input]
  const outDir = Array.isArray(input)
    ? "lib"
    : path.parse(input).dir.replace(/^src/, "lib")

  spawnSync(
    "npx",
    [
      "esbuild",
      ...files,
      "--format=esm",
      `--outdir=${outDir}`,
      "--platform=node",
      "--target=node16",
      "--sourcemap",
    ],
    { stdio: "inherit" },
  )
}

export default buildSource
