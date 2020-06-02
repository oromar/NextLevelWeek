import express from 'express'
import path from 'path'
import cors from 'cors'
import router from './routes'

const PORT: number = 3333
const app = express()
app.use(cors())
app.use(express.json())
app.use(
  '/public/images',
  express.static(path.resolve(__dirname, '..', 'public', 'images'))
)

app.use('/', router)
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
