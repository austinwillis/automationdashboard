var fs = require('fs');

var object = {};

var content = fs.readFileSync('tests.txt', 'utf8');

var array = content.split('\n');

array.forEach(function(item, index) {
  var test = item.split('\t');
  if (test[1] != undefined) {
    var testname = test[1].replace(/(\n|\r)+$/, '').replace('.', '_');
    object[testname] = { 'suite': test[0], 'lastResult': "Pass"}
  }
})

fs.writeFileSync('./data.json', JSON.stringify(object));
