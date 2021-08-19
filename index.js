const express = require("express")
const productos = require("./routes/productos.route")


const port = 8080
const app = express()

const server = app.listen(port, () => {
    console.log("Corriendo en el puerto " + server.address().port)
})


app.use('/api/productos', productos)
app.use(express.static('public'))
