var express = require('express')
var app = express()
var fs = require('fs')
// var https = require('https')
var bodyParser = require('body-parser')
var multer = require('multer')
var path = require('path')

// const options = {
//   key: fs.readFileSync('C:/Bitnami/redmine-3.4.6-1/apache2/conf/server.key'),
//   cert: fs.readFileSync('C:/Bitnami/redmine-3.4.6-1/apache2/conf/server.crt')
// }
// const folderPath = 'C:/Bitnami/redmine-3.4.6-1/apache2/htdocs/data'
const folderPath = 'C:/home/apache/htdocs/JS/data/'
// const folderPath = '/var/www/html/JS/data/'
// CORSを許可する
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({dest: './tmp/', limits: {fieldSize: 204800 * 1024}}).single('file'))

app.get('/dateandtime', function (req, res) {
  // res.sendFile(__dirname + '/' + 'up.html')
  // res.sendFile(path.join(__dirname, '/up.html'))
  let DD = new Date()
  let Hours = DD.getHours()
  let Minutes = DD.getMinutes()
  let Seconds = DD.getSeconds()
  let dateandtime = Hours + '時' + Minutes + '分' + Seconds + '秒'
  console.log('==== ' + dateandtime)
  let response = {
    message: 'Success!',
    dateandtime: dateandtime
  }
  let resp = JSON.stringify(response)
  setTimeout(function () { res.end(resp) }, 500)
  console.log('return')
  // res.end(resp)
})

app.post('/file_upload', function (req, res) {
  console.log('######')
  console.log(req)
  // let file = path.join(__dirname, '/public/images/' + req.body.originalname)
  console.log('---- チケットId : ', req.body.issueId)
  console.log('---- 添付Id : ', req.body.attachId)
  let file = path.join(folderPath, req.body.issueId)
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file)
  }
  file = path.join(file, req.body.attachId + '_' + req.file.originalname)
  console.log(file)
  console.log(req.file.path)
  fs.readFile(req.file.path, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      fs.writeFile(file, data, function (err) {
        let response
        if (err) {
          console.log(err)
        } else {
          response = {
            message: 'Success!',
            filename: req.file.originalname
          }
          // テンポラリファイルの削除
          let targetRemoveFiles = fs.readdirSync('tmp/')
          for (let file in targetRemoveFiles) {
            fs.unlinkSync('tmp/' + targetRemoveFiles[file], function (err) {
              if (err) {
                console.error(err)
                process.exit(1)
              } else {
                console.log('unlink : ' + targetRemoveFiles[file])
              }
            })
          }
        }
        console.log(response)
        let resp = JSON.stringify(response)
        res.end(resp)
      })
    }
  })
})

const port = 8081
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(path.join(__dirname, '/public/images'))
  console.log('listening at http://%s:%s', host, port)
})
// ----------
// var server = https.createServer(options, app)
// server.listen(port)
