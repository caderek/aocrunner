import express from "express"

const app = express()
const PORT = 1234

app
  .use(express.urlencoded({ extended: true }))
  .post("*", (req, res) => {
    const data = req.body

    console.log({ data })

    switch (data) {
      case "RIGHT":
        res.send("That's the right answer")
        break
      case "WRONG":
        res.send("That's not the right answer")
        break
    }
  })
  .listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`)
  })
