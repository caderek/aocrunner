import fs from "fs"

const copy = (fromDir: string, toDir: string) => {
  fs.cpSync(fromDir, toDir, { recursive: true })
}

export default copy
