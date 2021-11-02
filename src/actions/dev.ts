import kleur from "kleur"

const dev = (dayRaw: string | undefined) => {
  const day = dayRaw && (dayRaw.match(/\d+/) ?? [])[0]

  if (day === undefined) {
    console.log(kleur.red("No day specified."))
    process.exit(1)
  }

  const dayNum = Number(day)

  if (dayNum < 1 || dayNum > 25) {
    console.log(kleur.red("Wrong day - chose day between 1 and 25."))
    process.exit(1)
  }

  console.log({ day: dayNum })
}

export default dev
