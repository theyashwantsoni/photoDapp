var Jimp = require('jimp');
 
// open a file called "lenna.png"
Jimp.read('test.jpeg', (err, lenna) => {
  if (err) throw err;
  lenna
    .quality(100) // set JPEG quality
    .greyscale() // set greyscale
    .write('lena-small-bw.jpg'); // save
});
