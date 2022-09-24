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
  getBlogs,
  getOneBlog,
  postBlog,
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
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.get("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  getOneBlog(id)
    .then((blog) => {
      res.json(blog);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.post("/api/blog", (req, res) => {
  postBlog()
    .then((blog) => {
      res.json(blog);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

console.log(process.env.PG_DATABASE);

app.listen(port, () => console.log(`Server listening at port ${port}`));
