// generates a JSON file based on CSV output from
// https://docs.google.com/spreadsheets/d/1ZmNbq_A75hE9RnaCurP3jqwoUrxONv9DZSf4sF9TWQU/edit?usp=sharing

var fs = require('fs');
var csv = require('ya-csv');
var _ = require('lodash');

var importFile = './az-banners-all-sites.csv';

var adPlacements = [];

function save(fileName, data) {
  fs.writeFile(fileName, data, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file %s was saved", fileName);
    }
  });
}

var processAdPlacementConfig = function (data) {
  var filteredData = _.pick(data, [
      'website_id',
      'website_name',
      'site_id',
      'site_name',
      'placement_id',
      'placement_name',
      // 'placement_size',
      // 'placement_position',
      'placement_slot_id'
  ]);

  var sizeType = getSizeTypeForPlacement(filteredData);
  filteredData.placement_type = sizeType;

  return filteredData;
};

var getAdPlacementsByWebsiteId = function (collection, siteId) {
  return _.where(collection, { 'website_id': siteId});
};

var getAdSlotsBySiteId = function (collection, siteId) {
  return _.where(collection, { 'site_id': siteId});
};


var getAdSlotsByPlacementSlotId = function (collection, placementSlotId) {
  return _.where(collection, { 'placement_slot_id': placementSlotId});
};


var getSizeTypeForPlacement = function (placement) {
  var typeRegExp = /(Mobile|Tablet|Desktop)$/i;
  var matches = typeRegExp.exec(placement.placement_name);
  var bounds = { id: placement.placement_id, min: 729, max: 9999 };
  var sizeType = 'desktop';

  if(matches && matches.length) {
    var type = matches[0];
    sizeType = type.toLowerCase();
  }

  return sizeType;
}

var parseSiteSlots = function (siteSlots) {
  var siteIds = _.unique(_.pluck(siteSlots, 'site_id'));
  console.log(siteIds);

  // loop through all availble site_id of current site
  var sitePageTypes = _.map(siteIds, function (siteId) {
    var slots = getAdSlotsBySiteId(siteSlots, siteId);
    var placementSlotIds = _.unique(_.pluck(slots, 'placement_slot_id'));

    // loop through all placement slot ids and create config
    var siteTypeSlots = _.map(placementSlotIds, function (placementSlotId) {
      var slot = {
        name: placementSlotId
      };
      var placementSlots = getAdSlotsByPlacementSlotId(slots, placementSlotId);

      // omit non needed attributes
      placementSlots = _.map(placementSlots, function (placement) {
        var placementConfig = {
          id: placement.placement_id,
          name: placement.placement_name,
          type: placement.placement_type
        }

        return placementConfig;
      });

      slot.placements = placementSlots;

      return slot;
    });

    return {
      "site_name": slots[0].site_name,
      "site_id": siteId,
      "slots": siteTypeSlots
    }
  });

  return sitePageTypes;
}


var parseAdPlacements = function (adSlots) {
  var siteIds = _.unique(_.pluck(adSlots, 'website_id'));

  var allSiteSlots = _.map(siteIds, function (siteId) {
    var siteSlots = getAdPlacementsByWebsiteId(adSlots, siteId);
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
    data = processAdPlacementConfig(data);
    adPlacements.push(data);
  });

  reader.addListener('end', function() {
    console.log('Processing %s entries', adPlacements.length);
    allSiteSlots = parseAdPlacements(adPlacements);
    var output = JSON.stringify(allSiteSlots, undefined, 2);
    save('../app/node_modules/advertising/config/ad-config.json', output);
  });
};

readCSV();
