const { User } = require('../models/index.js');

//const index = require('../models/index.js');
//index.User

const UserController = {
    async create(req, res) {
        try {
            const user = await User.create(req.body)
            res.status(201).send({ msg: 'Usuario creado con éxito', user })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

module.exports = UserController
