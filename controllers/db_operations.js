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

function updateBlog(id, update) {
  return pool
    .query(
      `
      UPDATE blogs
      set user_name=$1, blog_date=$2, title=$3, rich_text=$4, blog_image=$5
      where id=$1
      returning *;
      `,
      [update.userName, update.blogDate, update.richText, update.blogImage, id]
    )
    .then((data) => {
      return data.rows;
    });
}

module.exports = {
  patchTable,
  updateBlog,
};
