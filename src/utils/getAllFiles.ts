import fs from "fs"
import path from "path"

const getAllFiles = (location: string): string[] => {
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

export default getAllFiles
