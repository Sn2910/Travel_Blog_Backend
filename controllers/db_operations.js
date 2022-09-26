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

// function postDestination(update) {
//   return pool
//     .query(
//       `
//     INSERT INTO destinations (country, city, language, country_coords, city_info, background_img_id)
//     values ($1, $2, $3, $4, $5, $6) returning *;
//     `,
//       [
//         update.country,
//         update.city,
//         update.language,
//         update.country_coords,
//         update.city_info,
//         update.background_img_id,
//       ]
//     )
//     .then((data) => {
//       return data.rows;
//     });
// }

// function getDestinations() {
//   return pool
//     .query(
//       `
//     SELECT * FROM destinations;
//     `
//     )
//     .then((data) => {
//       return data.rows;
//     });
// }

// function getDestinationByID(id) {
//   return pool
//     .query("SELECT * FROM destinations WHERE id =$1;", [id])
//     .then((data) => {
//       return data.rows;
//     });
// }

// function deleteDestination(id) {
//   return pool
//     .query("DELETE FROM destinations where id=$1;", [id])
//     .then((data) => {
//       return data.rows;
//     });
// }

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
  patchTable,
  postBlog,
  getBlogs,
  getBlogByID,
  updateBlog,
  deleteBlog,
};
