/*-------- Database Connection------*/
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true, 
  ssl: { rejectUnauthorized: false }
})

async function makeDatabaseQuery(sqlQuery, params) {
  let data;
  /* const client = await pool.connect() */
   try{
    const res= await pool.query(sqlQuery, params)
    /* client.release(); */
    data = res.rows;


  /* else if(destinationId === insertData){
    return client.query(sqlQuery, [insertData]).then((res) => {
      client.release();
      data = res.rows;
    });
  } */
   }catch(error){
    console.log(error.message)
    /* client.release(); */
    return null
   }
      
  return data;
 
}



async function patchTable(table, fieldMapping, id, req) {
  // updates  [{field: 'name', value: 'Changed Name'}, {field: 'address', value: 'New York'}, {field: phone, value: '23423423'}]
  const updates = Object.keys(req.body).map((param) => {
    return {
      field: fieldMapping[param],
      value: req.body[param],
    };
  });

  let updateQuery = [parseInt(id)];
  let updateFields = [];
  updates.forEach((element, index) => {
    updateQuery.push(element.value);
    updateFields.push(element.field + "=$" + (index + 2));
  });

  console.log("req.body", req.body);
  console.log("updateQuery", updateQuery);
  console.log("updateFields", updateFields);

  sql = `
      UPDATE ${table} 
      SET ${updateFields.toString(", ")} 
      WHERE id=$1`;

  console.log("sql", sql);
  return await makeDatabaseQuery(sql, updateQuery);
}

/**
 * This function calls getSingleData() for quering the destinations table of the database
 *  @params no params
 *  @return json object
 */
async function getDestinations() {
  /*  return pool.query(`SELECT * FROM destinations;`).then((data) => {
    return data.rows;
  }); */
  return await makeDatabaseQuery('SELECT * FROM "destinations";', null);
  
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
  

}
 async function getOneDestination(id) {
 
  makeDatabaseQuery('SELECT * FROM "destinations" WHERE id =$1;', [parseInt(id)]);
  const destinationObj = {
    id: parseInt(id),
  };
  const restaurants = await getDestinationRestaurants(destinationObj.id);
  const hotels = await getDestinationHotels(destinationObj.id);
  const shops = await getDestinationShops(destinationObj.id);
  destinationObj.restaurants = restaurants;
  destinationObj.hotels = hotels;
  destinationObj.shops = shops;
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
async function postCountry(countryObj) {
  const { country, city, language, countryCoords, cityInfo, backgroundImgId, backgroundImgUrl } = countryObj;
  
  return await makeDatabaseQuery('INSERT INTO "destinations" (country, city, language, country_coords, city_info, background_img_id, background_img_url) values ($1, $2, $3, $4, $5, $6, $7) returning *;',
     [country, city, language, countryCoords, cityInfo, backgroundImgId ,backgroundImgUrl] );
}
async function updateCountry(id, update) {
  
  let newbackimgid;
  if(update.backgroundImgId){
    newbackimgid = parseInt(update.backgroundImgId)
   
  }
  

  return await makeDatabaseQuery('UPDATE "destinations" set country=$1, city=$2, language=$3, country_coords=$4, city_info=$5, background_img_id=$6, background_img_url=$7, where id=$8 returning *;',
      [
        update.country,
        update.city,
        update.language,
        update.countryCoords,
        update.cityInfo,
        newbackimgid,
        update.backgroundImgUrl,
        parseInt(id),
      ]
    )
    
}
async function deleteDestination(id) {
  return await makeDatabaseQuery ("DELETE FROM destinations where id=$1;", [id])
    
}

/**
 * This function will create a new hotel
 *  @params hotel object as json
 *  @return ...
 *  @todo ...
 */
 async function getHotels() {
  //TODO:  Select data from Hotels table by destination id .Return Data as an Array
  return await makeDatabaseQuery('SELECT * FROM "hotels";', null);
}
 async function postHotel(hotel) {
  const { name, description, price, url, rating, reviews, destinationID, imageID, imageUrl } = hotel;
  return await makeDatabaseQuery('INSERT INTO "hotels" (name, description, price, url, rating, reviews, destination_id, image_id, image_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;',
     [name, description, parseFloat(price), url, parseFloat(rating), reviews, destinationID, imageID, imageUrl] );
}
async function deleteHotel(id) {
  return await makeDatabaseQuery ("DELETE FROM hotels where id=$1;", [id])
    
}

/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
async function getRestaurants() {
  return await makeDatabaseQuery('SELECT * FROM "restaurants";', null);
}
/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
 async function postRestaurant(restaurant) {
  const { name, description, price, url, rating, reviews, destinationID, imageID, imageUrl } = restaurant;
  return await makeDatabaseQuery('INSERT INTO "restaurants" (name, description, price, url, rating, reviews, destination_id, image_id, image_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;',
     [name, description, parseFloat(price), url, parseFloat(rating), reviews, destinationID, imageID, imageUrl] );
}
async function deleteRestaurant(id) {
  return await makeDatabaseQuery ("DELETE FROM restaurants where id=$1;", [id])
    
}

/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
 async function getShops() {
  return await makeDatabaseQuery('SELECT * FROM "shops";', null);
}
/**
 * This function ...
 *  @params ...
 *  @return ...
 *  @todo ...
 */
 async function postShop(shop) {
  const { name, description, price, url, rating, reviews, destinationID, imageID, imageUrl } = shop;
  return await makeDatabaseQuery('INSERT INTO "shops" (name, description, price, url, rating, reviews, destination_id, image_id, image_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;',
     [name, description, parseFloat(price), url, parseFloat(rating), reviews, destinationID, imageID, imageUrl] );
}
async function deleteShop(id) {
  return await makeDatabaseQuery ("DELETE FROM shops where id=$1;", [id])
    
}




function postBlog(update) {
  return pool
    .query(
      `
    INSERT INTO blogs (user_name, blog_date, title, rich_text, blog_image)
    values ($1, $2, $3, $4, $5) returning *;
    `,
      [
        update.userName,
        update.blogDate,
        update.title,
        update.richText,
        update.blogImage,
      ]
    )
    .then((data) => {
      return data.rows;
    });
}

function getBlogs() {
  return pool
    .query(
      `
    SELECT * FROM blogs;
    `
    )
    .then((data) => {
      return data.rows;
    });
}

function getBlogByID(id) {
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

function updateBlog(id, update) {
  return pool
    .query(
      `
      UPDATE blogs
      set user_name=$1, blog_date=$2, title=$3, rich_text=$4, blog_image=$5
      where id=$6
      returning *;
      `,
      [
        update.userName,
        update.blogDate,
        update.title,
        update.richText,
        update.blogImage,
        id,
      ]
    )
    .then((data) => {
      return data.rows;
    });
}

function deleteBlog(id) {
  return pool.query("DELETE FROM blogs where id=$1;", [id]).then((data) => {
    return data.rows;
  });
}

module.exports = {
  getDestinations,
  getOneDestination,
  patchTable,
  postBlog,
  getBlogs,
  getBlogByID,
  updateBlog,
  deleteBlog,
  getAssets,
  patchTable,
  postHotel,
  postRestaurant,
  postShop,
  postCountry,
  updateCountry,
  deleteDestination,
  getDestinationHotels,
  getHotels,
  getRestaurants,
  getShops,
  deleteHotel,
  deleteShop,
  deleteRestaurant

}
