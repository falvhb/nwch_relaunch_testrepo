// generates a JSON file based on CSV output from
// https://docs.google.com/spreadsheets/d/1ZmNbq_A75hE9RnaCurP3jqwoUrxONv9DZSf4sF9TWQU/edit?usp=sharing

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
      'placement_position',
      'placement_slot_id'
  ]);

  return filteredData;
};

var getAdSlotsByWebsiteId = function (siteId) {
  return _.where(adSlots, { 'website_id': siteId});
};

var getAdSlotsBySiteId = function (collection, siteId) {
  return _.where(collection, { 'site_id': siteId});
};


var getAdSlotsByPlacementSlotId = function (collection, placementSlotId) {
  return _.where(collection, { 'placement_slot_id': placementSlotId});
};


var getBoundsforAdSlot = function (slot) {
  var typeRegExp = /(Mobile|Tablet|Desktop)$/i;
  var matches = typeRegExp.exec(slot.placement_name);
  var bounds = { id: slot.placement_id, min: 729, max: 9999 };

  if(matches && matches.length) {
    var type = matches[0];
    switch (type) {
      case "Mobile":
        bounds = { id: slot.placement_id, min: 0, max: 727 };
        break;
      case "Tablet":
        bounds = { id: slot.placement_id, min: 728, max: 1024 };
        break;
      default:
        bounds = { id: slot.placement_id, min: 729, max: 9999 };
    }
  }
  return bounds;
}

var parseSiteSlots = function (siteSlots) {
  var siteIds = _.unique(_.pluck(siteSlots, 'site_id'));
  console.log(siteIds);

  // loop through all availble site_id of current site
  var sitePageTypes = _.map(siteIds, function (siteId) {
    var slots = getAdSlotsBySiteId(siteSlots, siteId);
    var placementSlotIds = _.unique(_.pluck(slots, 'placement_slot_id'));

    // loop through all placement slot ids and create config
    var siteTypePlacements = _.map(placementSlotIds, function (placementSlotId) {
      var placement = {
        name: placementSlotId
      };
      var placementSlots = getAdSlotsByPlacementSlotId(slots, placementSlotId);

      // placementSlots = _.map(placementSlots, function (slot) {
      //   return _.omit(slot, ['site_id', 'site_name']);
      // });

      placement.slots = placementSlots;
      placement.config = {
        responsive: {
          useresponsive: true,
          bounds: []
        },
        params: { target: '_blank' }
      };

      // create the bounds for the placement
      var bounds = _.map(placementSlots, getBoundsforAdSlot);
      placement.config.responsive.bounds = bounds;

      return placement;
    });

    return {
      "site_name": slots[0].site_name,
      "site_id": siteId,
      "placements": siteTypePlacements
    }
  });

  return sitePageTypes;
}


var parseAdSlots = function (adSlots) {
  var siteIds = _.unique(_.pluck(adSlots, 'website_id'));

  var allSiteSlots = _.map(siteIds, function (siteId) {
    var siteSlots = getAdSlotsByWebsiteId(siteId);
    var siteName = siteSlots[0].website_name;
    var output = {
      website_name: siteName,
      website_id: siteId
    }

    siteSlots = _.map(siteSlots, function (slot) {
      return _.omit(slot, ['website_id', 'website_name']);
    });

    // parse the siteSlots to group the placements
    siteSlots = parseSiteSlots(siteSlots);

    output.page_types = siteSlots;
    return output;
  });
  return allSiteSlots;
}

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
    allSiteSlots = parseAdSlots(adSlots);
    var output = JSON.stringify(allSiteSlots, undefined, 2);
    save('../app/node_modules/advertising/config/ad-config.json', output);
  });
};

readCSV();
