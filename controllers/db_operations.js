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
  

function getDestinationHotels(destinationId){
//TODO:  Select data from Hotels table by destination id .Return Data as an Array
}
function getDestinationRestaurants(destinationId){
 //TODO:  Select data from Restaurants table by destination id .Return Data as an Array
}
async function getOneDestination(destinationId){
    //TODO:  Select data for one Destination by destination id .Return Data as an Array.store in destinationObj
    const destinationObj = {
        
    };
    const restaurants = await getDestinationRestaurants(destinationObj.id)
    const hotels = await getDestinationHotels(destinationObj.id)
    destinationObj.restaurants = restaurants;
    destinationObj.hotels =hotels;
    return destinationObj;
   }
   function getDestination(){
    return pool.query(`SELECT * FROM destinations;`)
    .then((data)=>{ return data.rows})  

   }
   module.exports = {
    getDestinationHotels,
    getDestinationRestaurants,
    getOneDestination,
    getDestination
   }