
const express = require('express');
const db = require("../models/index.js");

//module.exports = app => {
const model = require("../app/routers/routers.js");
// const product = require("../app/routers/routers.js");
let router = express.Router();
//console.log(111);

// Create a new brand
router.post("/brands", (req, res) => {
  const brandValues = {
    name: req.body.name,
  };

  model.create(brandValues, 'Brand')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the brand."
      });
    });
});

router.post("/products", (req, res) => {

  const productValues = {
    name: req.body.name,
    amount: req.body.amount,
    units: req.body.units,
    brandId: req.body.brandId,
    categoryId: req.body.categoryId
  };

  model.create(productValues, 'Product')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the products."
      });
    });
});

router.post("/categories", (req, res) => {

  const productValues = {
    name: req.body.name,
  };

  model.create(productValues, 'Category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the categories."
      });
    });
});

router.post("/spects", (req, res) => {

  const spectValues = {
    name: req.body.name,
    value: req.body.value,
    productId: req.body.productId
  };

  model.create(spectValues, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the spects."
      });
    });
});

router.post("/orders", (req, res) => {

  const orderValues = {
    qty: req.body.qty,
    amount: req.body.amount,
    totalAmount: (req.body.qty) * (req.body.amount),
    productId: req.body.productId
  };

  model.create(orderValues, 'Order')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the orders."
      });
    });
});

router.post("/cart", (req, res) => {

  const cartValues = {
    qty: req.body.qty,
    status: req.body.status,
    amount: req.body.amount,
    totalAmount: (req.body.qty) * (req.body.amount),
    productId: req.body.productId
  };


  model.create(cartValues, 'Cart')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the cart."
      });
    });
});




// Retrieve all brand
router.get("/products/findall", (req, res) => {
  const filter = {
    where: {},
    include: [
      {
        model: db.Brand
        
      }
    ]
  };
  model.findAll(filter, 'Product')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
});

router.get("/spects/findall", (req, res) => {
  const filter = {
    where: {},
    include: [
      {
        model: db.Product,
      }
    ]
  };
  model.findAll(filter, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spects."
      });
    });
});



router.get("/cart/findall", (req, res) => {
  const filter = {
    where: {},
    include: [
      {
        model: db.Product,
        include: [
          {
            model: db.Brand
          }
        ]
      }
    ]
  };
  model.findAll(filter, 'Cart')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cart."
      });
    });
});

router.post("/order", (req, res) => {

  const orderValues = {
    qty: req.body.qty,
    amount: req.body.amount,
    productId: req.body.productId
  };

  model.create(orderValues, 'Order')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the order."
      });
    });
});


router.get("/orders/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Order')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Orders with id=" + id
      });
    });
});



router.get("/brands/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Brand')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
});

router.get("/products/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Product')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
});

router.get("/categories/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
});

router.get("/spects/:id", (req, res) => {
  const id = req.params.id;

  model.findByPk(id, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
});

router.put("/:id", model.update);


router.delete("/:id", model.delete);


router.delete("/brands/deleteAll", (req, res) => {
  model.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Mobiles were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all brands."
      });
    });
});
router.delete("products/deleteAll", (req, res) => {
  model.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Mobiles were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all products."
      });
    });
});

//router.use('/api/mobiles', router);
//};
module.exports = router;
