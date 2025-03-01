const { Product, Category, ProductImage } = require("../models");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category_id,
      min_price,
      max_price,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let where = { is_active: true };

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (min_price) {
      where.price = { ...where.price, [Op.gte]: min_price };
    }

    if (max_price) {
      where.price = { ...where.price, [Op.lte]: max_price };
    }

    let order;
    switch (sort) {
      case "price_low":
        order = [["price", "ASC"]];
        break;
      case "price_high":
        order = [["price", "DESC"]];
        break;
      case "oldest":
        order = [["createdAt", "ASC"]];
        break;
      case "newest":
      default:
        order = [["createdAt", "DESC"]];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: ProductImage,
          as: "images",
          where: { is_primary: true },
          required: false,
          limit: 1,
        },
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      status: "success",
      data: {
        products,
        pagination: {
          total: count,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          total_pages: totalPages,
          has_more: parseInt(page) < totalPages,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: ProductImage,
          as: "images",
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock,
      is_active = true,
    } = req.body;

    // Validate category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        status: "error",
        message: "Category not found",
      });
    }

    const product = await Product.create({
      category_id,
      name,
      description,
      price,
      stock,
      is_active,
    });

    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, stock, is_active } =
      req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // If category_id is provided, validate it exists
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          status: "error",
          message: "Category not found",
        });
      }
    }

    await product.update({
      category_id: category_id || product.category_id,
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      is_active: is_active !== undefined ? is_active : product.is_active,
    });

    res.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Soft delete - just mark as inactive
    await product.update({ is_active: false });

    res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.addProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, is_primary = false } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // If setting as primary, update existing primary images
    if (is_primary) {
      await ProductImage.update(
        { is_primary: false },
        { where: { product_id: id, is_primary: true } }
      );
    }

    const image = await ProductImage.create({
      product_id: id,
      image_url,
      is_primary,
    });

    res.status(201).json({
      status: "success",
      data: image,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const image = await ProductImage.findOne({
      where: {
        id: imageId,
        product_id: productId,
      },
    });

    if (!image) {
      return res.status(404).json({
        status: "error",
        message: "Image not found",
      });
    }

    await image.destroy();

    res.json({
      status: "success",
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
