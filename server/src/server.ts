import express from 'express'

const PORT: number = 3333
const app = express()
app.get('/users', (req, res) => {
  res.json(['User1', 'User2', 'User3', 'User4'])
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
