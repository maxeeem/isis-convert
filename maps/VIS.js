// var orwdb_headers = ["Part #",
//                     "UPC",
//                     "Transaction Description",
//                     "Generic Description",
//                     "Description 1",
//                     "Description 2",
//                     "Added Feature 1",
//                     "Added Feature 2",
//                     "Added Feature 3",
//                     "Bullet Feature 1",
//                     "Bullet Feature 2",
//                     "Bullet Feature 3",
//                     "S-LIFESPAN",
//                     "S-RAW_LUMENS",
//                     "S-Mounting Depth",
//                     "S-WARRANTY",
//                     "S-WATTS",
//                     "T-AMP DRAW",
//                     "T-DIMENSIONS",
//                     "T-Input Voltage",
//                     "T-Operating Temperature",
//                     "T-Product Height",
//                     "T-Product Length",
//                     "T-Product Width",
//                     "T-Product Weight"]


exports.tab = "VISION X" // set this to a relevant sheet name if source is an Excel file

var isis_headers = ["Part #",
                    "Transaction Description",
                    "UPC",
                    "Calculated MSRP",
                    "Jobber",
                    "AS-Packaged Length",
                    "AS-Packaged Width",
                    "AS-Packaged Height",
                    "AS-Packaged Weight"]

var path   = require('path')
var csv    = require('csv')
var output = './tmp/' + path.basename(__filename, '.js') + '.txt'

exports.transform = function transform(rows, res) {
    var results = []
    for (var i in rows) {
        var result = {}
        for (var k in isis_headers) {
            if (isis_headers[k] == 'Transaction Description') {
                if (rows[i][isis_headers[k]]) { // if not empty
                    var desc = rows[i][isis_headers[k]].replace(/\"/g, '\'\'')
                    desc = desc.replace(String.fromCharCode(186), 'deg')
                    var pos = desc.slice(0,25).lastIndexOf(' ')
                    result['Description 1'] = desc.slice(0, pos)
                    result['Description 2'] = desc.slice(pos+1).slice(0, 25)
                }
                else {
                    result['Description 1'] = ''
                    result['Description 2'] = ''
                }
            }
            else if (rows[i][isis_headers[k]]) { // if not empty
                result[isis_headers[k]] = rows[i][isis_headers[k]]
            }
            else {
                result[isis_headers[k]] = ''
            }
        }
        results[i] = result
    }
    
    csv()
        .from(results)
        .to(output, {delimiter: '\t'})
        .on('close', function() {
            res.download(output)
        })
}
