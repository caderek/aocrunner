# AoC Runner

This repo contains the utility library to create and run [Advent of Code](https://adventofcode.com/2021/about) solutions.

## Overview

- Creates JavaScript or TypeScript repository for AoC solutions with a simple CLI menu.
- Runs your solutions in watch mode (with extremely fast compilation for TS using [esbuild](https://esbuild.github.io/)).
- Allows you to fetch the input and send the solutions directly via terminal.
- Provides a template for AoC solutions that you can customize.
- Takes care of loading the input, measuring solution time, and running simple unit tests (supports async and sync code).
- Automatically creates and updates README file.

## Installation

To create the AoC solutions project run (requires Node 16+):

```
npx aocrunner init
```

It will guide you through the configuration with simple CLI menu.

## After installation

- Go to the projects directory.
- _(optional)_ initialize your version control system (ex: `git init`)
- _(optional)_ add your AoC session key to the `.env` file (you can find it in cookie file when you sign in at [adventofcode.com](https://adventofcode.com/))
- _(optional)_ customize your template folder `src/template`
- start solving the puzzles by running `start <day_number>` command with your package manager, for example:

```
npm start 1

// or

yarn start 1

// or

pnpm start 1
```

## Note about ES Modules

This library creates modern, ESM compatible project - that means that you have to specify the extensions in your imports (that are not imported from `node_modules`).

Always use `.js` extension for custom imports, even when importing `.ts` files (TypeScript ignores them, but the compiled code relies on them).

Examples:

```ts
// correct:

import _ from "lodash"
import myLib from "../utils/myLib.js"
import { myUtil } from "../utils/index.js"

// incorrect:

import _ from "lodash"
import myLib from "../utils/myLib.ts"
import { myUtil } from "../utils/index.ts"

// also incorrect:

import _ from "lodash"
import myLib from "../utils/myLib"
import { myUtil } from "../utils"
```

## License

Project is under open, non-restrictive [ISC license](LICENSE.md).
