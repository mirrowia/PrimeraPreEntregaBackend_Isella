const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");

const path = "../src/db/productos.json";

let products = [];

if (fs.existsSync(path)) {
  fs.readFile(path, "utf-8", function (err, data) {
    products = JSON.parse(data);
  });
} else {
  fs.writeFileSync(path, JSON.stringify([]));
}

//ENDPOINTS

//LIST ALL
router.get("/api/products", (req, res) => {
  if (products.length === 0) {
    res.json("No products found to be listed");
  } else {
    res.json({ products });
  }
});

//GET PRODUCT
router.get("/api/products/:pid", (req, res) => {
  const pid = req.params.pid;
  const product = products.findIndex((product) => product.id == pid);

  if (product < 0) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }
  return res.json(products[product]);
});

//ADD PRODUCT
router.post("/api/products", (req, res) => {
  const newProduct = req.body;
  if (
    newData.hasOwnProperty("title") &&
    newData.hasOwnProperty("description") &&
    newData.hasOwnProperty("code") &&
    newData.hasOwnProperty("price") &&
    newData.hasOwnProperty("status") &&
    newData.hasOwnProperty("stock") &&
    newData.hasOwnProperty("category")
  ) {
    const id = products.length <= 0 ? 1 : products[products.length - 1].id + 1;
    newProduct["id"] = id;
    products.push(newProduct);
    fs.writeFile(path, JSON.stringify(products), function (err) {
      if (err) throw err;
      res.json({ message: "Product Added" });
    });
  } else {
    return res.status(404).json({
      error:
        "Fields title, description, code, price, status, stock and category should not be empty",
    });
  }
});

//EDIT PRODUCT
router.put("/api/products/:pid", (req, res) => {
  const pid = req.params.pid;
  const newData = req.body;

  if (Object.keys(newData).length == 0) {
    return res
      .status(400)
      .json({ error: "No se proporcionaron datos para actualizar." });
  }

  if (newData.hasOwnProperty("id")) {
    return res.status(404).json({
      error:
        "No se puede editar el ID del producto. Favor de remover la propiedad id",
    });
  }

  const productIndex = products.findIndex((product) => product.id == pid);

  if (productIndex < 0) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...newData,
  };

  fs.writeFile(path, JSON.stringify(products), function (err) {
    if (err) throw err;
    res.json({ message: "Product Modified" });
  });
});

//DELETE PRODUCT
router.delete("/api/products/:pid", (req, res) => {
  const pid = req.params.pid;

  const productIndex = products.findIndex((product) => product.id == pid);

  if (productIndex < 0) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  products.splice(productIndex, 1);
  fs.writeFile(path, JSON.stringify(products), function (err) {
    if (err) throw err;
    return res.json("Product deleted");
  });
});

module.exports = router;
