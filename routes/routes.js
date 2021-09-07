const express = require('express');
const db = require("../models/index.js");
const Op = db.Sequelize.Op;

//module.exports = app => {
const model = require("../app/routers/routers.js");
// const { Sequelize } = require('../models/index.js');
// const { eq } = require('sequelize/types/lib/operators');
// const { Op } = require('sequelize/types');
// const OrderItem = require('../models/OrderItem.js');
// const Order = require('../models/Order.js');
// const Cart = require('../models/Cart.js');
// const product = require("../app/routers/routers.js");
let router = express.Router();

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

router.post("/products", async (req, res) => {

  const brand_data = await model.findOne({ where: { id: req.body.brandId } }, 'Brand')
  const category_data = await model.findOne({ where: { id: req.body.categoryId } }, 'Category')


  if (!brand_data || !category_data) {
    res.send("Invalid Entry for Category/Brand ID!")
  }

  else {
    const productValues = {
      name: req.body.name,
      amount: req.body.amount,
      units: req.body.units,
      brandId: req.body.brandId,
      categoryId: req.body.categoryId
    };



    const prod = await model.create(productValues, 'Product')
    const arr = [];

    req.body.spects.forEach((element, index) => {
      arr.push({
        name: element.name,
        value: element.value,
        productId: prod.id
      })
    });

    const spek = await db.Spect.bulkCreate(arr, { returning: true });
    res.send(spek);
  }

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

router.post("/cart", async (req, res) => {

  const prod_data = await model.findOne({ where: { id: req.body.productId } }, 'Product')

  if (!prod_data) {
    res.send("Invalid Product ID!");
  }

  else {
    const cartValues = {
      qty: req.body.qty,
      status: true,
      amount: req.body.amount,
      totalAmount: (req.body.qty) * (req.body.amount),
      productId: req.body.productId
    };

    const cartVal = await model.findOne({
      where: {
        productId: req.body.productId,
        status: true
      }
    }, 'Cart');



    if (cartVal) {

      db.Cart.update({
        qty: cartValues.qty + cartVal.qty,
        totalAmount: cartValues.totalAmount + cartVal.totalAmount
      },
        {
          where: { id: cartVal.id }
        }
      );
      res.send("Product already present in the Cart! #Quantity Updated \n")
    }
    else {
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
    }

  }
}

);

router.get("/search", async (req, res) => {

  const OpAlias = {
    $like: Op.like
  }
  const str = req.query.str;
  const list = await db.Product.findAll({
    where: {
      name: { [Op.like]: `%${str}%` },

    },
  });
  res.send(list)
});




router.get("/products/findall", async (req, res) => {
  
  const cid = req.query.categoryId
  const bid = req.query.brandId
  let str;
  if(!req.query.str) { 
    str=""
    //console.log("No String!")
} 
  else { str= req.query.str}
   //console.log(str)}

  if (!cid && !bid) {
    const OpAlias = {
      $iLike: Op.iLike
    }

    let list = await db.Product.findAll({
      where: {
         [Op.or]:[
          {name: { [Op.iLike]: `%${str}%` }},
         {'$Brand.name$':{ [Op.iLike] : `%${str}%`}}]
      },
    include : [{
      model : db.Brand,
      // where : { name: { [Op.iLike]: `%${str}%` }},
      required : true,
      attributes : ['name']
    }]      
  })
    res.send(list)
  }

  else if (cid && !bid) {
    const OpAlias = {
      $iLike: Op.iLike
    }
   // str = req.query.str;
    let list = await db.Product.findAll({
      where: {
        name: { [Op.iLike]: `%${str}%` },
        categoryId: cid

      },
    })
    res.send(list)

  }

  else if (!cid && bid) {
    const OpAlias = {
      $iLike: Op.iLike
    }
    //str = req.query.str;
    let list = await db.Product.findAll({
      where: {
        name: { [Op.iLike]: `%${str}%` },
        brandId: bid

      },
    });
    res.send(list)

  }

  else {
    const OpAlias = {
      $iLike: Op.iLike
    }
  //  str = req.query.str;
    let list = await db.Product.findAll({
      where: {
        name: { [Op.iLike]: `%${str}%` },
        brandId: bid,
        categoryId: cid

      },
    });
    res.send(list)
  }

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
    where: { status: true },
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

// router.post("/order", (req, res) => {

//   const orderValues = {
//     qty: req.body.qty,
//     amount: req.body.amount,
//     productId: req.body.productId
//   };

//   model.create(orderValues, 'Order')
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the order."
//       });
//     });
// });


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

router.put("/product/:id", async (req, res) => {

  const ID = req.params.id;
  const spec = [];

  const produ = await db.Product.update(
    {
      name: req.body.name,
      amount: req.body.amount,
      units: req.body.units,
      brandId: req.body.brandId,
      categoryId: req.body.categoryId
    },
    {
      where:
        { id: ID, }
    },
    res.send("Updated Successfully!")
  )


  if (req.body.spec) {

    const opr={};

    req.body.spec.forEach((element) => {
      spec.push({
        id: element.id,
        value: element.value,
        method: element.method,
        name: element.name,
        productId: ID
      })
    })

    spec.forEach(async(element) => {

      if (element.method === 'update') {
       opr= await db.Spect.update(
          { value: element.value,
            name: element.name
           },
          { where: { id: element.id } })
      }

      else if (element.method === 'create') {
       opr = await db.Spect.create(
          {
            name: element.name,
            value: element.value,
            productId: ID
          }
        )
      }
      
      else {
        await db.Spect.destroy(
          {where : {id : element.id }}
          )
        res.send("Deleted Successfully!")
      }
    })

    res.send(opr)
    }

  });


router.get("/product/filterc/:cid", async (req, res) => {

  const prod_filter = await db.Product.findAll(
    {
      where: { categoryId: req.params.cid }
    }
  );
  res.send(prod_filter);


});

router.get("/product/filterb/:bid", async (req, res) => {

  const brad_filter = await db.Product.findAll(
    {
      where: { brandId: req.params.bid }
    }
  );
  res.send(brad_filter);


});


router.delete("/:id", model.delete);

router.post("/checkout", async (req, res) => {

  const data = await db.Cart.findAll({
    where: { status: true }
  });

  console.log(JSON.parse(JSON.stringify(data)));

  const cartJSON = JSON.parse(JSON.stringify(data));
  let sum = 0;
  cartJSON.forEach((element) => {
    sum += element.totalAmount;
  });
  console.log(sum);
  const curr_order = await model.create({ "totalAmount": sum }, 'Order');

  const arr = [];
  cartJSON.forEach((element) => {
    arr.push({
      qty: element.qty,
      productId: element.productId,
      amount: element.amount,
      OrderId: curr_order.id
    })
  });

  await model.bulkcreate(arr, 'OrderItem');

  const order = await model.findOne({ where: { id: curr_order.id }, include: [{ model: db.OrderItem, as: 'OrderItems' }] }, 'Order')
  res.send(order);
});



router.delete("/brands/deleteAll", (req, res) => {
  model.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Brands were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all brands."
      });

    });
});
router.delete("/products/:id", (req, res) => {
  db.Product.destroy({
    where: {id: req.params.id},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Product was deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing the product."
      });
    });
});


module.exports = router;
