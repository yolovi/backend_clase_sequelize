const express = require("express")
const { typeError } = require("./middleware/errors")
const app = express()
const PORT = 3000

//MIDDLEWARE
app.use(express.json())

//RUTAS
app.use("/users", require("./routes/users"))
app.use("/posts", require("./routes/posts"))

// Middleware de errores (después de TODAS las rutas)
app.use(typeError);



//SERVIDOR
app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`)
})
