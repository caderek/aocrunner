import prompts from "prompts"
import kleur from "kleur"

const onCancel = () => {
  process.exit()
}

const commandPrompt = () => {
  return prompts(
    [
      {
        type: "text",
        name: "command",
        message: ``,
      },
    ],
    { onCancel },
  )
}

export default commandPrompt
