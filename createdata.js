var fs = require('fs');

var object = [];

var content = fs.readFileSync('tests.txt', 'utf8');

var array = content.split('\n');

array.forEach(function(item) {
  console.log(item);
  var test = item.split('\t');
  if (test[1] != undefined) {
    var testname = test[1].split('.')[1].replace(/(\n|\n)+$/, '')
    var testobject = {}
    testobject['suite'] = test[0];
    testobject['testname'] = testname;
    testobject['last-result'] = "Pass";
    object.push(testobject);
  }
})

fs.writeFileSync('./data.json', JSON.stringify(object));
