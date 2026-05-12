import express from "express"
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import routes from './routes/index.route'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as database from './config/database'
const app = express()

const port = process.env.PORT || 4000;
database.connect()
// Cho phép gửi dữ liệu dạng JSON
app.use(express.json());
// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'PATCH', 'POST', "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Cho phép gửi cookie
}))

app.use(cookieParser())

// Thiết lập đường dẫn
app.use('/', routes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
