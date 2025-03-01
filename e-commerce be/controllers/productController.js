const { Product, Category, ProductImage } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['name']
        },
        {
          model: ProductImage,
          where: { is_primary: true },
          required: false
        }
      ]
    });

    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};