var fs = require('fs');

var object = {};
var results = {};
var suites = {}

var date = (new Date).getTime();

var content = fs.readFileSync('tests.txt', 'utf8');

var array = content.split('\n');

array.forEach(function(item, index) {
  var test = item.split('\t');
  if (test[1] != undefined) {
    var testname = test[1].replace(/(\n|\r)+$/, '').replace('.', '_');
    var resultsObject = {};
    suites[testname] = { 'suite': test[0], 'lastResult': 'Pass', 'status': 'Consistent' };
    results[testname] = {'delete' : 'me'};
  }
})

object['results'] = results;
object['tests'] = suites;
fs.writeFileSync('./data.json', JSON.stringify(object));
