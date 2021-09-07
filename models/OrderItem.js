'use strict';
module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define("OrderItem", {
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    // productId:{
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // }

  });

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Order, {
      foreignKey: {
        name: 'OrderId',
        allowNull: false
    }}),
      OrderItems.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false
        }
    })
  };

  return OrderItems;
};
