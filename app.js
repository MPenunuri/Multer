const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function (req,file,cb){
        checkFileType(file,cb)
    }
}).single('myImage')

function checkFileType(file,cb){
    const fileTypes = /jpeg|jpg|png|gif/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: solo se admiten imágenes')
    }

}

const app = express();

app.set('view engine','ejs');

app.use(express.static('./public'))

app.get('/', (req,res) => res.render('index'));

app.post('/upload', (req, res) => {
    //res.send('probando')
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        } else {
            if(req.file == undefined){
                res.render('index',{
                    msg: 'Error: no seleccionaste ningún archivo.'
                })
            } else {
                res.render('index',{
                    msg: 'Carga existosa del archivo.',
                    file: `uploads/${req.file.filename}`
                })
            }
        } 
    });
});

const port = 3000;

app.listen(port, () => console.log(`Servidor inicializado en puerto${port}`));