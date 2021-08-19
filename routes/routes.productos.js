const express = require('express')
const router = express.Router()

var multer = require('multer');
var upload = multer();

let storage = multer.diskStorage ({
    destination: function (req, file, callback){
        callback(null, "uploads")
    },
    filename:function(req, file, callback){
        callback(null, file.originalname)
    }
})
let uploadFile = multer({storage})

let productos = []

class Producto {
    constructor (title, price, thumbnail) {
        this.id = productos.length+1
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }
}

var removeItemFromArr = ( arr, item ) => {
    var i = arr.indexOf( item );
    i !== -1 && arr.splice( i, 1 );
};


productos.push(new Producto ("Campera", 7800, "/foto3.jpg"))
productos.push(new Producto ("Buzos", 4800, "/foto4.jpg"))



router.get("/", (req, res) => {
    try{
        if(productos.length == 0){
            res.status(404).json({"error": "No hay productos guardados"})
        }else {
            res.status(200).json(productos)
        }
    }catch(err) {
        res.status(404).json({err})
    }

})


router.get("/:id", (req, res) => {
    try{
        if (req.params.id <= (productos.length)) {
            res.status(200).json(productos[req.params.id-1])
        } else {
            res.status(404).json({"error": "No se encontraron productos"})
        }
    }catch(err) {
        res.status(404).json({err})
    }
})

router.post("/guardar", (req, res) => {
   
    let title = req.query.title
    let price = parseInt(req.query.price)
    let thumbnail = req.query.thumbnail
  
    try{
            productos.push(new Producto(title, price, thumbnail))
            res.status(200).json(productos[productos.length -1])
        
    }catch(err) {
        res.status(404).json(err)
    }
})


router.put("/update/:id", (req, res) => {

    try {
        let id = parseInt(req.params.id)
        productos[id-1] = {
            "id": parseInt(id),
            "title": req.query.title,
            "price": parseInt(req.query.price),
            "thumbnail": req.query.thumbnail
        }
        res.json(productos[id-1])
    } catch(err){
        throw new Error(err)
    }
})

router.delete("/delete/:id", (req, res) => {

    try {

        let id = parseInt(req.params.id)

            if(id-1 < productos.length){
                res.status(200).json(productos[id-1])
                removeItemFromArr(productos, productos[id-1])
            } else {
                res.status(200).json({"msg":"No se encontraron productos"})
            }
    
    }catch(err) {
        throw new error(err)
    }
   
})


router.use(express.json()); 

router.use(express.urlencoded({ extended: true })); 

router.post("/guardarform", uploadFile.single("thumbnail"),(req, res) => {
    let title = req.body.title
    let price = parseInt(req.body.price)
    let thumbnail = req.file.path
  
    try{
            if (!req.file) {
                const error = new Error("No hay archivos")
                error.httpStatusCode = 400
                return next(error)
            }
            productos.push(new Producto(title, price, thumbnail))
            res.send(productos[productos.length -1])
        
    }catch(err) {
        res.status(404).json(err)
    }
})

module.exports = router;
