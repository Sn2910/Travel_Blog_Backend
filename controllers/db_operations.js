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

async function patchTable(table, fieldMapping, id, req) {
  // updates  [{field: 'name', value: 'Changed Name'}, {field: 'address', value: 'New York'}, {field: phone, value: '23423423'}]
  const updates = Object.keys(req.body).map((param) => {
    return {
      field: fieldMapping[param],
      value: req.body[param],
    };
  });

  let updateQuery = [id];
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
  return pool.query(sql, updateQuery);
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

/**
 * This is a generic PostgreSQL database select fetch function
 * @params sqlQuery is the complete string
 * @returns result of the database query
 * @todo refacoring: fields contains the fields to return, idField represents the field name in the where clause, id represents the identificator to look for. The commented code is ready to run
 * @date 2022-09-23
 */
async function getSingleData(sqlQuery, destinationId) {
  // const idField = `destination_id`;
  // const fields = [];
  // const fieldString = fields.length === 0 ? "*" : "";
  // fieldString !== "*" &&
  //   fields.forEach(field =>
  //     fieldString === ""
  //       ? fieldString.concat("'", field, "'")
  //       : fieldString.concat(fieldString, ", '", field, "'")
  //   );

  // const queryString = idField !== "" ? `SELECT ${fieldString} FROM '${table}' WHERE ${idField} = $1;` : `SELECT ${fieldString} FROM '${table}'`;

  let data;
  await pool
    .connect()
    .then(async (client) => {
      // return client.query(sqlQuery, [destinationId]).then(res => {
      if (destinationId === null)
        return client.query(sqlQuery).then((res) => {
          client.release();
          data = res.rows;
        });
      return client.query(sqlQuery, [destinationId]).then((res) => {
        client.release();
        data = res.rows;
      });
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
  return await getSingleData(
    'SELECT * FROM "hotels" WHERE  destination_id = $1;',
    destinationId
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
  return await getSingleData(
    'SELECT * FROM "shops" WHERE  destination_id =$1;',
    destinationId
  );
}

/**
 * This function calls getSingleData() for quering the restaurants table of the database
 *  @params destinationId represents the id to lookup for
 *  @return json object
 */
async function getDestinationRestaurants(destinationId) {
  //TODO:  Select data from Restaurants table by destination id .Return Data as an Array
  return await getSingleData(
    'SELECT * FROM "restaurants" WHERE  destination_id =$1;',
    destinationId
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
  return await getSingleData('SELECT * FROM "destinations";', null);
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
  getSingleData('SELECT * FROM "destinations" WHERE id =$1;', id);
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
  /* return (dbData = pool.query(`SELECT * FROM assets;`).then((data) => {
    return data.rows;
  })); */
  return await getSingleData('SELECT * FROM "assets";', null);
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
  getDestinationHotels,
  getDestinationRestaurants,
  getOneDestination,
  getDestination,
  getDestinationShops,
  getAssets,
  patchTable,
  postBlog,
  getBlogs,
  getBlogByID,
  updateBlog,
  deleteBlog,
};
