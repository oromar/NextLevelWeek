import express from 'express'

const PORT: number = 3333
const app = express()
app.get('/users', (_, res) => {
  res.send('Hello World!!!')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
