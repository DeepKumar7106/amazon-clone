import express from "express";
import cors from "cors";
import oracledb from "oracledb";

oracledb.fetchAsString = [oracledb.CLOB];

const app = express();
app.use(cors());
app.use(express.json());

//logs into the sqlplus
const dbConfig = {
    user: "DEEP7106",
    password: "KONATA7106",
    connectString: "localhost/XEPDB1" // crucial step
};

app.get("/products", async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT id, name, price, rating, category, src, description
       FROM amazon_clone_products`,
       [],
       { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});

/* ===============================
   HELPER: GET OR CREATE CART
================================ */
async function getOrCreateCart(connection, userId) {
  // 1. Look for ACTIVE cart
  const result = await connection.execute(
    `SELECT cart_id
     FROM amazon_clone_cart
     WHERE user_id = :userId
       AND status = 'ACTIVE'`,
    { userId }
  );

  if (result.rows.length > 0) {
    return result.rows[0][0];
  }

  // 2. Create new cart if none exists
  const insertResult = await connection.execute(
    `INSERT INTO amazon_clone_cart (user_id, status)
     VALUES (:userId, 'ACTIVE')
     RETURNING cart_id INTO :cartId`,
    {
      userId,
      cartId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    }
  );

  return insertResult.outBinds.cartId[0];
}

/* ===============================
   ADD TO CART
================================ */
app.post("/cart/add", async (req, res) => {
    console.log("🔥 /cart/add HIT", req.body); // ADD THIS LINE
  const { productId } = req.body;
  const userId = "guest";

  if (!productId) {
    return res.status(400).json({ error: "productId required" });
  }

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const cartId = await getOrCreateCart(connection, userId);

    try {
      await connection.execute(
        `INSERT INTO amazon_clone_cart_list
         (cart_id, product_id, quantity)
         VALUES (:cartId, :productId, 1)`,
        { cartId, productId }
      );
    } catch (err) {
      // ORA-00001 → duplicate → already in cart → ignore
      if (err.errorNum !== 1) throw err;
    }

    await connection.commit();

    res.json({ success: true, inCart: true });

  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

/* ===============================
   REMOVE FROM CART
================================ */
app.delete("/cart/remove", async (req, res) => {
    console.log("🔥 /cart/add HIT", req.body); // ADD THIS LINE
  const { productId } = req.body;
  const userId = "guest";
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT cart_id
       FROM amazon_clone_cart
       WHERE user_id = :userId
         AND status = 'ACTIVE'`,
      { userId }
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, inCart: false });
    }

    const cartId = result.rows[0][0];

    await connection.execute(
      `DELETE FROM amazon_clone_cart_list
       WHERE cart_id = :cartId
         AND product_id = :productId`,
      { cartId, productId }
    );

    await connection.commit();

    res.json({ success: true, inCart: false });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

/* ===============================
   GET CART
================================ */
app.get("/cart", async (req, res) => {
  const userId = "guest";
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT
         p.id,
         p.name,
         p.price,
         p.src,
         cl.quantity
       FROM amazon_clone_cart c
       JOIN amazon_clone_cart_list cl ON c.cart_id = cl.cart_id
       JOIN amazon_clone_products p ON p.id = cl.product_id
       WHERE c.user_id = :userId
         AND c.status = 'ACTIVE'`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({ items: result.rows });

  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    if (connection) await connection.close();
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

