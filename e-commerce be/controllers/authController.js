const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashPassword,
      full_name,
      phone_number,
    });

    res.status(201).json({
      status: "Success",
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "user not found",
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: " Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: "success",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
        status: 'error',
        message: error.message
    })
  }
};
