import { spawnSync } from "child_process"
import path from "path"

const buildSource = (input: string | string[]) => {
  const files = Array.isArray(input) ? input : [input]
  const outDir = Array.isArray(input)
    ? "dist"
    : path.parse(input).dir.replace(/^src/, "dist")

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
