
const { Pool } = require("PG");
const {
  patchTable,
  postBlog,
  updateBlog,
  getBlogByID,
  getBlogs,
  deleteBlog,
} = require("./controllers/db_operations");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//TODO : Import db operations controller functions here
const {
  getDestinationHotels,
  getDestinationRestaurants,
  getOneDestination,
  getDestination,
  getDestinationShops,
  getAssets,
} = require("./controllers/db_operations");

function sendErrorOutput(err, res) {
  res.status(400).send({
    errors: [err.message],
  });
}

// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//   ssl: true,
//   ssl: { rejectUnauthorized: false },
// }); // Move all to db-operation

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

app.get("/api/destinations/:id", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()
  const { id } = req.params;

  getOneDestination(id)
    .then((destination) => {
      res.json(destination);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});
4;
app.get("/api/assets", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()

  getAssets()
    .then((assets) => {
      res.json(assets);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.get("/api/blog", (req, res) => {
  getBlogs()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
});

app.get("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  getBlogByID(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
});

app.post("/api/blog", (req, res) => {
  postBlog(req.body).then((data) => {
    res.json(data);
  });
});

app.put("/api/blog/:id", (req, res) => {
  const { id } = req.params;

  if (
    !req.body.userName ||
    !req.body.blogDate ||
    !req.body.title ||
    !req.body.richText ||
    !req.body.blogImage
  ) {
    return res
      .status(400)
      .send({ error: "Some field(s) are missing. Check API documentation" });
  }

  updateBlog(id, req.body)
    .then((updatedData) => {
      res.send(updatedData);
    })
    .catch((err) => sendErrorOutput(err, res));
});

app.patch("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  const fieldMapping = {
    userName: "user_name",
    blogDate: "blog_date",
    title: "title",
    richText: "rich_text",
    blogImage: "blog_image",
    id,
  };

  patchTable("blogs", fieldMapping, id, req)
    .then(() => {
      res.send({ status: "updated" });
    })
    .catch((err) => sendErrorOutput(err, res));
});

app.delete("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  deleteBlog(id)
    .then(() => {
      res.send({ status: "deleted" });
    })
    .catch((err) => sendErrorOutput(err, res));
});

console.log(process.env.PG_DATABASE);

app.listen(port, () => console.log(`Server listening at port ${port}`));
