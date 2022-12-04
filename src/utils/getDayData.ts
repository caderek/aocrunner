import path from "path"
import os from "os"

const getFilesTrace = () => {
  const regex =
    os.platform() === "win32"
      ? /[A-Z]:(\\|\/).*\.(m?)js/gm
      : /(?<=file:\/\/).*\.(m?)js/gm

  return new Error().stack?.match(regex)
}

const getDayData = () => {
  const dirs = getFilesTrace()?.map((file) =>
    path.parse(file).dir.split(/\\|\//),
  )

  const dayDir = dirs?.find((chunks) =>
    /^day\d\d$/.test(chunks[chunks.length - 1]),
  )

  if (!dayDir) {
    return {
      day: null,
      inputFile: null,
    }
  }

  const distPos = dayDir?.lastIndexOf("dist")

  if (distPos !== -1) {
    dayDir[distPos] = "src"
  }

  return {
    day: Number(dayDir[dayDir.length - 1].slice(-2)),
    inputFile: [...dayDir, "input.txt"].join(path.sep),
  }
}

export default getDayData
