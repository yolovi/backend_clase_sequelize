const express = require("express")
const UserController = require("../controllers/UserController")
const { authentication } = require("../middleware/authentication")
const router = express.Router()

router.post("/", UserController.create)
router.post("/login", UserController.login)
router.get("/", authentication, UserController.getAll)
router.get('/confirm/:emailToken',UserController.confirm)
router.put("/id/:id", authentication,  UserController.update)
router.delete("/logout", authentication, UserController.logout)
router.delete("/id/:id", authentication, UserController.delete)

module.exports = router