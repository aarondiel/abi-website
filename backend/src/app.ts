import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import config from './config'
import endpoints from './endpoints/route'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', endpoints)

app.listen(config.port, () => {
	console.log('test')
	console.log(`listening on: http://localhost:${config.port}`)
})
