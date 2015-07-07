var fs = require('fs');
var csv = require('ya-csv');
var _ = require('lodash');

var importFile = './az-banners-all-sites.csv';

var adSlots = [];

function save(fileName, data) {
  fs.writeFile(fileName, data, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file %s was saved", fileName);
    }
  });
}

var processAdSlotConfig = function (data) {
  var filteredData = _.pick(data, [
      'website_id',
      'website_name',
      'site_id',
      'site_name',
      'placement_id',
      'placement_name',
      'placement_size',
      'placement_position'
  ]);

  return filteredData;
};

var readCSV = function () {

  var reader = csv.createCsvFileReader(importFile, {
    columnsFromHeader: true
    }
  );

  reader.addListener('data', function(data) {
    data = processAdSlotConfig(data);
    adSlots.push(data);
  });

  reader.addListener('end', function() {
    console.log('Processing %s entries', adSlots.length);
    var output = JSON.stringify(adSlots, undefined, 2);
    save('./az-banners-all-sites.json', output);
  });
};

readCSV();
