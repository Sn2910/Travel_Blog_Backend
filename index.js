require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

//TODO : Import db operations controller functions here
const {
  getDestinations,
  getOneDestination,
  deleteDestination,
  postBlog,
  postCountry,
  getBlogs,
  getBlogByID,
  updateBlog,
  deleteBlog,
  getAssets,
  patchTable,
  postHotel,
  postRestaurant,
  postShop,
  updateCountry,
  getDestinationHotels,
  getHotels
} = require("./controllers/db_operations");

const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
  res.send("Testing");
});
/* ---------Assets Api----------- */

app.get("/api/assets", (req, res) => {
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



/* ---------Destination Api----------- */
app.get("/api/destinations", (req, res) => {
  getDestinations()
    .then((destinations) => {
      res.json(destinations);
    })
    .catch((err) => sendErrorOutput(err, res));
});


app.get("/api/destinations/:id", (req, res) => {
  const { id } = req.params;
  getOneDestination(id)
    .then((data) => {
      res.json(data);
    })
    /* .catch((err) => sendErrorOutput(err, res)); */
});
app.post("/api/destinations", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()
  postCountry(req.body)
    .then((destination) => {
      res.json(destination);
    })
    .catch((err) => sendErrorOutput(err, res));
});

app.put("/api/destinations/:id", (req, res) => {
  const { id } = req.params;

  if (
    !req.body.country ||
    !req.body.city ||
    !req.body.language ||
    !req.body.countryCoords ||
    !req.body.cityInfo ||
    !req.body.backgroundImgId ||
    !req.body.backgroundImgUrl) {
    return res
      .status(400)
      .send({ error: "Some field(s) are missing. Check API documentation" });
  }

  updateCountry(id, req.body)
    .then((updatedData) => {
      res.send(updatedData);
    })
    .catch((err) => sendErrorOutput(err, res));
});


app.patch("/api/destinations/:id", (req, res) => {
  const { id } = req.params;
  if(req.body.backgroundImgId){
    req.body.backgroundImgId = parseInt(req.body.backgroundImgId)
  }
  const fieldMapping = {
    country: "country",
    city: "city",
    language: "language",
    countryCoords: "country_coords",
    cityInfo: "city_info",
    backgroundImgId:"background_img_id",
    backgroundImgUrl:"background_img_url"
  };

  patchTable("destinations", fieldMapping, id, req)
    .then(() => {
      res.send({ status: "updated" });
    })
    /* .catch((err) => sendErrorOutput(err, res)); */
});
app.delete("/api/destinations/:id", (req, res) => {
  const { id } = req.params;
  deleteDestination(id)
    .then(() => {
      res.send({ status: "deleted" });
    })
    .catch((err) => sendErrorOutput(err, res));
});




/* ---------Hotel Api----------- */

app.post("/api/hotel", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()
  postHotel(req.body)
    .then((hotel) => {
      res.status(201);
      res.json(hotel);
    })
    .catch((err) => sendErrorOutput(err, res));
});
app.get("/api/hotels", (req, res) => {

  getHotels()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
});
app.patch("/api/hotel/:id", (req, res) => {
  const { id } = req.params;
  const update = req.body
 
  update.destinationID =update.destinationID ? parseInt(update.destinationID): null
  update.imageID = update.imageID ? parseInt(update.imageID): null
  update.price =   update.price  ? parseFloat(update.price):null
  update.rating = update.rating ? parseFloat(update.rating): null 
  update.reviews=  update.reviews ? parseInt(update.reviews): null
console.log(update)
  const fieldMapping = {
    name: "name",
    description: "description",
    price: "price",
    url: "url",
    rating: "rating",
    reviews:"reviews",
    destinationID:"destination_id",
    imageID:"image_id",
    imageUrl:"image_url"
  };
  patchTable("hotels", fieldMapping, id, req)
    .then(() => {
      res.send({ status: "updated" });
    })
    /* .catch((err) => sendErrorOutput(err, res)); */
});
/* ---------Restaurant Api----------- */

app.post("/api/restaurant", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()
  postRestaurant(req.body)
    .then((restaurant) => {
      res.status(201);
      res.json(restaurant);
    })
    .catch((err) => sendErrorOutput(err, res));
});
/* ---------Shop Api----------- */
app.post("/api/shop", (req, res) => {
  // TODO: Replace Db operations with call to getDestination()
  postShop(req.body)
    .then((shop) => {
      res.status(201);
      res.json(shop);
    })
    .catch((err) => sendErrorOutput(err, res));
});

/* ---------Blog Api----------- */
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
  postBlog(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
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
