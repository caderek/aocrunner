export type Setup = {
	name: string
    year: number
    language: "ts" | "js"
	packageManager: "npm" | "yarn" | "pnpm"
	author: string
	semicolons: boolean
	strict: boolean
}

type PartConfig = {
  solved: boolean
  result: any
  attempts: any[]
  time: null | number
}
  
  
export type DayConfig = {
  title: null | string;
  part1: PartConfig; 
  part2: PartConfig 
}

export type YearConfig = {
  year: number
  days: DayConfig[]
}

export type Config = {
  packageManager: "npm" | "yarn" | "pnpm"
  language: "ts" | "js"
  version: number
  years: YearConfig[]
}
