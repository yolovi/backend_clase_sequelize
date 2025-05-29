
const { User, Post, Token, Sequelize } = require('../models/index.js');
const { Op } = Sequelize
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../config/config.json")["development"]

//const index = require('../models/index.js');
//index.User

const UserController = {
    async create(req, res, next) {
        try {
            //req.body.role = "user"
            //const user = await User.create(req.body)
            const password = await bcrypt.hash(req.body.password, 10)
            const user = await User.create({ ...req.body, password: password, role: "user" })
            res.status(201).send({ msg: 'Usuario creado con éxito', user })
        } catch (error) {
            console.log(error)
            next(error)
            // res.status(500).send(error) //sustituido por next(error)
        }
    },
    async login(req, res) {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!user) {
                return res.status(400).send({ message: "Usuario o contraseña incorrectos" })
            }
            if (!isMatch) {
                return res.status(400).send({ message: "Usuario o contraseña incorrectos" })
            }
            const token = jwt.sign({ id: user.id }, jwt_secret);
            await Token.create({ token, UserId: user.id });
            res.send({ message: 'Bienvenid@ ' + user.name, user, token });
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    async getAll(req, res) {
        try {
            const users = await User.findAll({
                include: [Post]
            })
            res.status(200).send({ msg: 'Todos los usuarios', users })
        } catch (error) {
            res.status(500).send(error)
        }
    },
    async update(req, res) {
        await User.update(req.body,
            {
                where: {
                    id: req.params.id
                }
            })
        res.send('Usuario actualizado con éxito');
    },
    async logout(req, res) {
        try {
            await Token.destroy({
                where: {
                    [Op.and]: [
                        { UserId: req.user.id },
                        { token: req.headers.authorization }
                    ]
                }
            });
            res.send({ message: 'Desconectado con éxito' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'hubo un problema al tratar de desconectarte' })
        }
    },
    async delete(req, res) {
        await User.destroy({
            where: {
                id: req.params.id
            }
        })
        await Post.destroy({
            where: {
                UserId: req.params.id
            }
        })
        res.send(
            'El usuario ha sido eliminado con éxito'
        )
    },
}

module.exports = UserController
