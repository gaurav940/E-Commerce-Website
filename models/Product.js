'use strict';
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,

    },
    units: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
  // { timestamps: false}
);

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: 'brandId',
      // allowNull: false
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      // allowNull : false
    });
    Product.hasMany(models.Spect, {
      foreignKey: 'productId',
      // allowNull:false
    });
    }


  return Product;
};
