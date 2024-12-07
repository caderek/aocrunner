import PackageJson from "@npmcli/package-json"
import { PackageConfig, PackageConfigDefaults } from "../types/common.js"

export const readConfigFromPackageJson = async () => {
  const pkgJson = await PackageJson.load('./')
  const aocRunnerPkgConfig = {
    ...PackageConfigDefaults,
    ...pkgJson.content.aocrunner as PackageConfig
  }
  Object.entries(aocRunnerPkgConfig).forEach(([k, v]) => {
    process.env[`aocrunner_${k}`] = String(v)
  })
}
  