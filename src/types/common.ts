export type Setup = {
  year: number
  name: string
  language: "ts" | "js"
  packageManager: "npm" | "yarn" | "pnpm"
  author: string
  semicolons: boolean
  tabWidth: number
  nodeVersion: number
  strict: boolean
}

type DayConfig = {
  solved: boolean
  result: any
  attempts: any[]
  time: null | number
}

export type Config = {
  version: number
  year: number
  language: "js" | "ts"
  days: { part1: DayConfig; part2: DayConfig }[]
}

export type PackageConfig = {
  tabWidth: number
}
export const PackageConfigDefaults = {
  tabWidth: 2,
} as PackageConfig
