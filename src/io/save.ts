import fs from "fs"
import path from "path"

const save = (dir: string, file: string, content: string | {}) => {
  fs.writeFileSync(
    path.join(dir, file),
    typeof content === "string" ? content : JSON.stringify(content, null, +(process.env.aocrunner_tabWidth||2)),
  )
}

export default save
