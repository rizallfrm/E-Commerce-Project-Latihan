const { Category, Product } = require('../models');
const slugify = require('slugify');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          where: { is_active: true },
          required: false
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    const slug = slugify(name, { lower: true });
    
    const category = await Category.create({
      name,
      slug
    });
    
    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    const slug = slugify(name, { lower: true });
    
    await category.update({
      name,
      slug
    });
    
    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.count({
      where: { category_id: id }
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete category: it has associated products'
      });
    }
    
    await category.destroy();
    
    res.json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};