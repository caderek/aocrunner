export type Setup = {
  year: number
  name: string
  language: "ts" | "js"
  packageManager: "npm" | "yarn" | "pnpm"
  author: string
  semicolons: boolean
  strict: boolean
}
