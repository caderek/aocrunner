const tsconfigJSON = {
  compilerOptions: {
    target: "es2020",
    module: "es2020",
    removeComments: true,
    declaration: true,
    outDir: "./lib",
    preserveConstEnums: true,
    strict: true,
    allowSyntheticDefaultImports: true,
  },
  include: ["src"],
  exclude: ["node_modules", "src/**/*.test.ts", "src/**/*.temp.ts"],
}

export default tsconfigJSON
