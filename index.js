const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const {Pool} = require('pg')
const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())
const port = process.env.PORT || 8000;
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: true,
    ssl: { rejectUnauthorized: false },
})
app.get('/',(req,res)=>{
    res.send(`
    <h1>Welcome to my library</h1>
    <p>API contains endpoints
     <ul>
       <li>api/books</li>
     </ul>
    </p>
    `)
})
console.log(process.env.PG_DATABASE)
app.listen(port, ()=> console.log('server Listening at ' +port))