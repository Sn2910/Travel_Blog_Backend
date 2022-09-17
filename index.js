const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("PG");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send("Testing");
});
app.get("/api/destinations",(req, res) => {
  pool
    .query(
      `
    SELECT * FROM destinations;
    `
    )
    .then((data) => {
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
})
app.get("/api/destinations/:id",(req, res) => {
  const {id} = req.params;
  pool
    .query('SELECT * FROM destinations WHERE id =$1;',[id])
    .then((data) => {
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
})

app.get("/api/blog", (req, res) => {
  pool
    .query(
      `
    SELECT * FROM blogs;
    `
    )
    .then((data) => {
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.get("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query(
      `
    SELECT * FROM blogs WHERE id=$1;
    `,
      [id]
    )
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.post("/api/blog", (req, res) => {
  pool
    .query(
      `
    INSERT INTO blogs (user_name, blog_date, title, rich_text)
    values ($1, $2, $3, $4) returning *;
    `,
      [req.body.userName, req.body.blogDate, req.body.title, req.body.richText]
    )
    .then((data) => {
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

console.log(process.env.PG_DATABASE);

app.listen(port, () => console.log(`Server listening at port ${port}`));
