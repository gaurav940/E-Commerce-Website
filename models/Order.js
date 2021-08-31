'use strict';
module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    qty: {
      type: Sequelize.INTEGER,
      //primaryKey: true,
      allowNull: false,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
    });
  };

  return Order;
};
