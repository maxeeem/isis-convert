// Manufacturer data converter
var express    = require('express'),
    multiparty = require('multiparty'),
    XLSX       = require('xlsx'),
    XLS        = require('xlsjs'),
    csv        = require('csv'),
    fs         = require('fs')

var app = express()

app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')
app.set('views', __dirname + "/views") // needed for external js files
app.use(express.static(__dirname + "/views")) // needed for external js files

app.listen('80')
console.log("Waiting for connections on port 80...")

app.get('/', function(req, res) {
    res.render('index', {title: 'Universal Converter', script: "/js/checkForm.js"},
        function(err, html) {
            if (err) {
                res.send("There was an error in processing your request.")
            }
            else {
                res.send(html)
            }
        }
    )
})

app.post('/', function(req, res) {
  // res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin':'*'})
  var form = new multiparty.Form()
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.send("There was an error in processing your request.")
    }

    var brand = require('./maps/' + fields.brand + '.js')
    var parts = []

    switch (files.loadsheets[0].originalFilename.slice(-4).toUpperCase()) {
        case "XLSX":
            var loadsheet = XLSX.readFile(files.loadsheets[0].path)
            parts = XLSX.utils.sheet_to_row_object_array(loadsheet.Sheets[brand.tab])
            brand.transform(parts, res)
            break
        case ".XLS":
            var loadsheet = XLS.readFile(files.loadsheets[0].path)
            parts = XLS.utils.sheet_to_row_object_array(loadsheet.Sheets[brand.tab])
            brand.transform(parts, res)
            break
        case ".TXT":
        case ".CSV":
            csv()
            .from.path(files.loadsheets[0].path, {columns: true})
            .to.array(function(data) {
                brand.transform(data, res)
            })
            break
        default:
            res.send("Unknown file format.")
    }
    
  })
})
