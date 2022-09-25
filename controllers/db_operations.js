const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

/**
 * This is a generic PostgreSQL database select fetch function
 * @params sqlQuery is the complete string
 * @returns result of the database query
 * @todo refacoring: fields contains the fields to return, idField represents the field name in the where clause, id represents the identificator to look for. The commented code is ready to run
 * @date 2022-09-23
 */
async function makeDatabaseQuery(sqlQuery, params) {
  let data;
  await pool
    .connect()
    .then(async (client) => {
      return client.query(sqlQuery, params).then((res) => {
        client.release();
        data = res.rows;
      });

      /* else if(destinationId === insertData){
        return client.query(sqlQuery, [insertData]).then((res) => {
          client.release();
          data = res.rows;
        });

      } */



    })
    .catch((e) => {
      console.log(e.stack);
    });
  return data;
}

/**
 * This function calls getSingleData() for quering the hotel table of the database
 *  @params destinationId represents the id to lookup for
 *  @return json object
 */
async function getDestinationHotels(destinationId) {
  //TODO:  Select data from Hotels table by destination id .Return Data as an Array
  return await makeDatabaseQuery(
    'SELECT * FROM "hotels" WHERE  destination_id = $1;',
    [destinationId]
  );

  // return pool
  //   .query("SELECT * FROM hotels WHERE  destination_id =$1;", [destinationId])
  //   .then((data) => {
  //     return data.rows;
  //   });
}

/**
 * This function calls getSingleData() for quering the shops table of the database
 *  @params destinationId represents the id to lookup for
 *  @return json object
 */
async function getDestinationShops(destinationId) {
  //TODO:  Select data from Hotels table by destination id .Return Data as an Array
  return await makeDatabaseQuery(
    'SELECT * FROM "shops" WHERE  destination_id =$1;',
    [destinationId]
  );
}

/**
 * This function calls getSingleData() for quering the restaurants table of the database
 *  @params destinationId represents the id to lookup for
 *  @return json object
 */
async function getDestinationRestaurants(destinationId) {
  //TODO:  Select data from Restaurants table by destination id .Return Data as an Array
  return await makeDatabaseQuery(
    'SELECT * FROM "restaurants" WHERE  destination_id =$1;',
    [destinationId]
  );
  /*  return pool
    .query("SELECT * FROM restaurants WHERE  destination_id =$1;", [
      destinationId,
    ])
    .then((data) => {
      return data.rows;
    }); */
}

/**
 * This function calls getSingleData() for quering the destinations table of the database
 *  @params no params
 *  @return json object
 */
async function getDestination() {
  /*  return pool.query(`SELECT * FROM destinations;`).then((data) => {
    return data.rows;
  }); */
  return await makeDatabaseQuery('SELECT * FROM "destinations";', null);
}

/**
 * This function calls getSingleData() for quering the destinations table of the database
 *  @params id represents the id to lookup for
 *  @return json object
 *  @todo outsourcing of everything except the database functionallity
 */
async function getOneDestination(id) {
  //TODO:  Select data for one Destination by destination id .Return Data as an Array.store in destinationObj

  /* pool.query("SELECT * FROM destinations WHERE id =$1;", [id]).then((data) => {
    return data.rows;
  }); */
  makeDatabaseQuery('SELECT * FROM "destinations" WHERE id =$1;', [id]);
  const destinationObj = {
    id: id,
  };
  const restaurants = await getDestinationRestaurants(destinationObj.id);
  console.log(restaurants);
  const hotels = await getDestinationHotels(destinationObj.id);
  const shops = await getDestinationShops(destinationObj.id);
  destinationObj.restaurants = restaurants;
  destinationObj.hotels = hotels;
  destinationObj.shops = shops;
  console.log(destinationObj);

  return destinationObj;
}

/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
async function getAssets() {
  //TODO:  Select data from Hotels table by destination id .Return Data as an Array
  return await makeDatabaseQuery('SELECT * FROM "assets";', null);
}
/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
async function postCountry(insertData) {
  const { country, city, language, countryCoords, cityInfo, backgroundImgId } = insertData;
  return await makeDatabaseQuery('INSERT INTO "destinations" (country, city, language, country_coords, city_info, background_img_id ) values ($1, $2, $3, $4, $5, $6) returning *;',
     [country, city, language, countryCoords, cityInfo, backgroundImgId] );
}

async function getBlogs() {
  return pool.query(`SELECT * FROM blogs;`).then((data) => {
    return data.rows;
  });
}
async function getOneBlog(id) {
  return pool
    .query(
      `
    SELECT * FROM blogs WHERE id=$1;
    `,
      [id]
    )
    .then((data) => {
      return data.rows;
    });
}
async function postBlog() {
  return pool
    .query(
      `
        INSERT INTO blogs (user_name, blog_date, title, rich_text)
        values ($1, $2, $3, $4) returning *;
        `,
      [req.body.userName, req.body.blogDate, req.body.title, req.body.richText]
    )
    .then((data) => {
      return data.rows;
    });
}

module.exports = {
  getDestinationHotels,
  getDestinationRestaurants,
  getOneDestination,
  getDestination,
  getDestinationShops,
  getAssets,
  getBlogs,
  getOneBlog,
  postBlog,
  postCountry
};
