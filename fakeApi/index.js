import express from "express"

const app = express()
const PORT = 1234

app
  .use(express.urlencoded({ extended: true }))
  .post("*", (req, res) => {
    const data = req.body

    switch (data.answer) {
      case "RIGHT":
        res.send("<main>That's the right answer</main>")
        break
      case "WRONG":
        res.send("<main>That's not the right answer</main>")
        break
      default:
        res.send("<main>Oops</main>")
    }
  })
  .get("*", (req, res) => {
    res.send("1 2 3 4 5")
  })
  .listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`)
  })
