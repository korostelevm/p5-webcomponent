const express = require('express')
const path = require("path");
const app = express()

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static(path.join(__dirname, 'public'), options))
// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
//   });

app.listen(process.env.PORT || 3000)
