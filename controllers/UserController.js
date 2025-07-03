const { User, Post, Token, Sequelize } = require("../models/index.js");
const { Op } = Sequelize;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer.js");
const { jwt_secret } = require("../config/config.json")["development"];

//const index = require('../models/index.js');
//index.User

const UserController = {
  async create(req, res, next) {
    try {
      //req.body.role = "user"
      //const user = await User.create(req.body)
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: password,
        confirmed: false,
        role: "user",
      });
      const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
        expiresIn: "48h",
      });
      //   const url = "http://localhost:3000/users/confirm/" + emailToken;
      // await transporter.sendMail({
      //     to: req.body.email,
      //     subject: "Confirme su registro",
      //     html: `<h3> Bienvenido, estás a un paso de registrarte </h3>
      //     <a href="${url}"> Clica para confirmar tu registro</a>
      //     `,
      // });
      res.status(201).send({
        message: "Te hemos enviado un correo para confirmar el registro",
        user,
      });
    } catch (error) {
      console.log(error);
      next(error);
      // res.status(500).send(error) //sustituido por next(error)
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      // if (!user.confirmed) {
      //     return res.status(400).send({ message: "Debes confirmar tu correo" })
      // }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!user) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const token = jwt.sign({ id: user.id }, jwt_secret);
      await Token.create({ token, UserId: user.id });
      res.send({ message: "Bienvenid@ " + user.name, user, token });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.findAll({
        include: [Post],
      });
      res.status(200).send({ msg: "Todos los usuarios", users });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async update(req, res) {
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.send("Usuario actualizado con éxito");
  },
  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, jwt_secret);
      User.update(
        { confirmed: true },
        {
          where: {
            email: payload.email,
          },
        }
      );
      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error);
    }
  },
  async logout(req, res) {
    try {
      await Token.destroy({
        where: {
          [Op.and]: [
            { UserId: req.user.id },
            { token: req.headers.authorization },
          ],
        },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "hubo un problema al tratar de desconectarte" });
    }
  },
  async delete(req, res) {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    await Post.destroy({
      where: {
        UserId: req.params.id,
      },
    });
    res.send("El usuario ha sido eliminado con éxito");
  },
};

module.exports = UserController;
