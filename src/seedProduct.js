import oracledb from "oracledb"; //imports the db library
import {products} from "./data.js"; //the data which needed to be seeded

//logs into the sqlplus
const dbConfig = {
  user: "DEEP7106",
  password: "KONATA7106",
  connectString: "localhost/XEPDB1" // crucial step
};

async function seedProducts() {
  let connection; 

  try {
    //establishes the connection by entering credentials 
    connection = await oracledb.getConnection(dbConfig);

    //iterates over all the data 
    for (const p of products) {
        //writes the sql query to insert the values and executes it
      await connection.execute(
        `INSERT INTO amazon_clone_products
         (id, name, price, rating, description, category, src)
         VALUES
         (:id, :name, :price, :rating, :description, :category, :src)`,
        {
          id: p.id,
          name: p.name,
          price: p.price,
          rating: p.rating,
          description: p.description,
          category: p.category,
          src: p.src
        }
      );
    }
    //after insertion it commits
    await connection.commit();
    console.log(`✅ Seeded ${products.length} products`);

  } catch (err) {
    console.error("❌ Seeding failed:", err);

  } finally {
    if (connection) {
        //closes the connection 
      await connection.close();
    }
  }
}

seedProducts();
