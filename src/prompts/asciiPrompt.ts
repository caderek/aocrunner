import prompts from "prompts"

enum AsciiOptions {
  INTERPRETED,
  AS_IS,
  CANCEL,
}

const asciiPrompt = (part: 1 | 2) => {
  return prompts(
    [
      {
        type: "select",
        name: "choice",
        message: "What do you want to do?",
        choices: [
          {
            title: "Provide interpreted solution",
            value: AsciiOptions.INTERPRETED,
          },
          {
            title: "Send as is",
            value: AsciiOptions.AS_IS,
          },
          {
            title: "Cancel",
            value: AsciiOptions.CANCEL,
          },
        ],
        initial: 0,
      },
      {
        type: (prev) => (prev === AsciiOptions.INTERPRETED ? "text" : null),
        name: "replacement",
        message: `Solution part ${part}`,
      },
    ],
    {
      onCancel: () => {
        process.exit()
      },
    },
  )
}

export { AsciiOptions }
export default asciiPrompt
