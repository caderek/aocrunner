export type Setup = {
  year: number
  language: "ts" | "js"
  packageManager: "npm" | "yarn" | "pnpm"
  author: string
  semicolons: boolean
}
