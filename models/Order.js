'use strict';

const OrderItem = require("./OrderItem");

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    // amount: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  // Order.associate = (models) => {
  //   Order.belongsTo(models.Cart, {
  //     foreignKey: {
  //       name: 'cartId',
  //       allowNull: false
  //     },
  //   });
  // };

  Order.associate = (models) => {
     Order.hasMany(models.OrderItem,{
       foreignKey : {
         name:'OrderId',
         allowNull:false
       }, 
       as: 'OrderItems'
     })
  }



  return Order;
};
