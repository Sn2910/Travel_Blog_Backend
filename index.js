const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//TODO : Import db operationsa controller functions here
const {
  getDestinationHotels,
  getDestinationRestaurants,
  getOneDestination,
  getDestination,
} = require("./controllers/db_operations");
const port = process.env.PORT || 3000;
// TODO: Move to db_operations.js

app.get("/", (req, res) => {
  res.send("Testing");
});
app.get("/api/destinations", (req, res) => {
  getDestination()
    .then((destinations) => {
      res.json(destinations);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

/* app.get("/api/destinations/:id",(req, res) => {
  // TODO: Replace Db operations with call to getDestination()
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
 */
console.log(process.env.PG_DATABASE);

app.listen(port, () => console.log(`Server listening at port ${port}`));
