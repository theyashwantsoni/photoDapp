var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
var uniqid = require('uniqid');
var Jimp = require('jimp');
const image2base64 = require('image-to-base64');
var app = express();
app.set('view engine', 'ejs');
var base64Img = require('base64-img');

app.get('/', (req, res) => {
    res.render('index');
});
var tempname='';
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        tempname=uniqid();
        var dir = './uploads/'+tempname;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files', 12);
app.post('/upload', function (req, res, next) {
    console.log(req.files);
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        var filenames = req.files.map(function(file) {
            return file.filename; // or file.originalname
          });
          console.log('uploads/'+tempname+'/'+filenames);
          Jimp.read('uploads/'+tempname+'/'+filenames, (err, lenna) => {
            if (err) throw err;
            lenna
              .quality(100) 
              .greyscale() 
              .write('uploads/'+tempname+'/'+'grey-'+filenames)
              .crop(20, 20, 100, 100) 
              .write('uploads/'+tempname+'/'+'crop-'+filenames); 
                base64Img.base64('uploads/'+tempname+'/'+'crop-'+filenames, function(err, data) {
                            console.log(data);
                        });
                    // Jimp.read('uploads/'+tempname+'/'+'grey-'+filenames, (err, penny) => {
                    //     if (err) throw err;
                    //     penny
                    //     .quality(100) // set JPEG quality
                    //     .crop(20, 20, 100, 100) // set greyscale
                    //     .write('uploads/'+tempname+'/'+'crop-'+filenames); // save
                    //     console.log('cropped');
                    //     base64Img.base64('uploads/'+tempname+'/'+'crop-'+filenames, function(err, data) {
                    //         console.log(data);
                    //     });    
                    // });
          });


        res.send(req.files);
        
    });
})

app.listen(3000);
