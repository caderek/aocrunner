import { exec } from "child_process"

const getLatestVersion = (): Promise<string | null> => {
  return new Promise((resolve) => {
    exec("npm view aocrunner versions --json", (err, stdout) => {
      if (err) {
        resolve(null)
      }

      try {
        const versions = JSON.parse(stdout) as string[]
        resolve(versions.at(-1) || null)
      } catch {
        resolve(null)
      }
    })
  })
}

export default getLatestVersion
