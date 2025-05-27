const { Post, User, Sequelize } = require("../models/index.js");
const { Op } = Sequelize

const PostController = {
    async create(req, res) {
        try {
            const post = await Post.create(req.body)
            res.status(201).send({ msg: "Post creado con éxito", post })
        } catch (error) {
            res.status(500).send(error)
        }
    },
    async getAll(req, res) {
        try {
            const posts = await Post.findAll({
                // include: [User]
                include: [{ model: User, attributes: ["name", "email"] }]
            })
            res.status(200).send(posts)
        } catch (error) {
            console.log(err)
            res.status(500).send({ message: 'Ha habido un problema al cargar las publicaciones' })
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [User]
            })
            res.status(200).send(post)
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un problema al cargar la publicación' })
        }
    },
    async getOneByName(req, res) {
        try {
            const post = await Post.findOne({
                where: {
                    title: {
                        [Op.like]: `%${req.params.title}%`
                    }
                },
                include: [User]
            })
            res.status(200).send(post)
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un problema al cargar la publicación' })
        }
    },
    async delete(req, res) {
        await Post.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send(
            'La publicación ha sido eliminada con éxito'
        )
    },

}



module.exports = PostController