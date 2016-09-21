var fs = require('fs');

var object = {};

var content = fs.readFileSync('tests.txt', 'utf8');

var array = content.split('\n');

array.forEach(function(item, index) {
  var test = item.split('\t');
  if (test[1] != undefined) {
    var testname = test[1].replace(/(\n|\r)+$/, '')
    var testobject = {}
    testobject['suite'] = test[0];
    testobject['testname'] = testname;
    testobject['last-result'] = "Pass";
    console.log(index);
    object[index.toString()] = testobject;
  }
})

fs.writeFileSync('./data.json', JSON.stringify(object));
