require('dotenv').config()
const PORT = process.env.PORT
const express = require('express')
const app = express()

const publicRoutes = require('./server/routes/public-routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

app.use('/', publicRoutes)

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'not found' })
})
