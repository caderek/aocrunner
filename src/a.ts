import run from "./index.js"

const ex = {
  part1: {
    solution: (x: string) => Number(x),
    tests: [
      { input: "1", expected: 1 },
      { input: "1", expected: 1 },
      { input: "1", expected: 2 },
    ],
  },
}

run(ex)
