const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

const path = "../src/db/carrito.json";

let carts = [];

if (fs.existsSync(path)) {
  fs.readFile(path, "utf-8", function (err, data) {
    carts = JSON.parse(data);
  });
} else {
  fs.writeFileSync(path, JSON.stringify([]));
}

// ENDPOINST

//ADD CART
router.post("/api/carts", (req, res) => {
  const newCart = req.body;
  if (newCart.hasOwnProperty("products")) {
    const id = carts.length <= 0 ? 1 : carts[carts.length - 1].id + 1;
    newCart["id"] = id;
    console.log(newCart);
    carts.push(newCart);
    fs.writeFile(path, JSON.stringify(carts), function (err) {
      if (err) throw err;
      res.json({ message: "Cart created" });
    });
  } else {
    return res.status(404).json({
      error: "No product added to cart",
    });
  }
});

//GET CART
router.get("/api/carts/:cid", (req, res) => {
  const cid = req.params.cid;
  const cart = carts.findIndex((cart) => cart.id == cid);

  if (cart < 0) {
    return res.status(404).json({ error: "Cart not found." });
  }
  if (carts[cart].products.length > 0) {
    return res.json(carts[cart].products);
  } else {
    return res.json("Empty cart");
  }
});

//ADD PRODUCT TO CART
router.post("/api/carts/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cartIndex = carts.findIndex((cart) => cart.id == cid);

  if (cartIndex < 0) {
    return res.status(404).json({ error: "Cart not found." });
  }

  const productIndex = carts[cartIndex].products.findIndex(
    (product) => product.id == pid
  );

  if (productIndex < 0) {
    carts[cartIndex].products.push({ id: parseInt(pid), quantity: 1 });
    fs.writeFile(path, JSON.stringify(carts), function (err) {
      if (err) throw err;
      return res.json("New product added to cart");
    });
  } else {
    carts[cartIndex].products[productIndex].quantity++;
    fs.writeFile(path, JSON.stringify(carts), function (err) {
      if (err) throw err;
      return res.json("Product stock updated");
    });
  }
});

module.exports = router;
