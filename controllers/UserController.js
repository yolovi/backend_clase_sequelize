const { User, Post } = require('../models/index.js');

//const index = require('../models/index.js');
//index.User

const UserController = {
    async create(req, res) {
        try {
            req.body.role = "user"
            const user = await User.create(req.body)
            res.status(201).send({ msg: 'Usuario creado con éxito', user })
        } catch (error) {
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
