const { User, Token, Sequelize } = require('../models');
const { Op } = Sequelize;
const jwt = require('jsonwebtoken');
const  {jwt_secret}  = require('../config/config.json')['development']

const authentication = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, jwt_secret); //en el payload tenemos el id
        const user = await User.findByPk(payload.id); //usuario logueado
        const tokenFound = await Token.findOne({ //buscamos el token en la tabla de Tokens
            where: {
                [Op.and]: [
                    { UserId: user.id },
                    { token: token }
                ]
            }
        });
        if (!tokenFound) {
            return res.status(401).send({ message: 'No estas autorizado' });
        }
        req.user = user; //creamos una nueva propiedad en la request. 
        next(); //te permite continuar al endpoint → sigue con la ejecución del código -> de la función ruta
    } catch (error) {
        console.log(error)
        res.status(500).send({ error, message: 'Ha habido un problema con el token' })
    }
}

const isAdmin = async(req, res, next) => {
    const admins = ['admin','superadmin'];
    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: 'No tienes permisos'
        });
    }
    next();
}

module.exports = { authentication, isAdmin }



