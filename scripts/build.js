import { spawnSync } from "child_process"
import fs from "fs"
import path from "path"
import chokidar from "chokidar"
import kleur from "kleur"

const watch = process.argv[2] === "--watch"

const createVersionFile = () => {
  const packageInfo = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" }),
  )

  fs.writeFileSync(
    "src/version.ts",
    `/* This file is auto-generated - do not modify */\nexport default "${packageInfo.version}"`,
  )
}

const getAllFiles = (location) => {
  const entities = fs.readdirSync(location, { withFileTypes: true })

  const files = entities
    .filter((entity) => entity.isFile())
    .map((entity) => path.join(location, entity.name))
    .filter((file) => [".ts", ".js", ".mjs"].includes(path.parse(file).ext))

  const dirs = entities
    .filter((entity) => entity.isDirectory())
    .map((entity) => entity.name)

  return [
    ...files,
    ...dirs.map((dir) => getAllFiles(path.join(location, dir))).flat(),
  ]
}

const build = (input) => {
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
    ],
    { stdio: "inherit", shell: true },
  )
}

const buildDefinitions = () => {
  console.log("\nBuilding definition files...\n")
  const t0 = process.hrtime.bigint()
  spawnSync("tsc", ["--emitDeclarationOnly", "--outDir", "lib"], {
    stdio: "inherit",
    shell: true,
  })
  const t1 = process.hrtime.bigint()
  const time = (Number(t1 - t0) / 1e6).toFixed(0)

  console.log("⚡", kleur.green(`Done in ${time}ms`))
}

const files = getAllFiles("src")

if (watch) {
  build(files)

  chokidar
    .watch("src", { ignoreInitial: true })
    .on("add", (path) => build(path))
    .on("change", (path) => build(path))
} else {
  if (fs.existsSync("lib")) {
    console.log("Removing old build...")
    fs.rmSync("lib", { recursive: true })
    console.log("Building source files...")
  }

  createVersionFile()
  build(files)
  buildDefinitions()
}
