// generates a JSON file and HTML includes for the advertising configuration
// based on CSV export from AdTech

var fs = require('fs');
var csv = require('ya-csv');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var toSlug = require('to-slug');
var getSkinFromDomain = require('../app/node_modules/helpers/get-skin-from-domain');
var outputPath = '../app/assets/includes/advertising/';

var importFile = './az-banners-all-sites.csv';
var csvColumnNames = [
  'websiteId',
  'websiteName',
  'categoryName',
  'categoryComment',
  'siteId',
  'siteName',
  'placementId',
  'placementName',
  'placementSize',
  'placementPosition',
  'placementType',
  'placementStatus',
  'commissionCPM',
  'commissionType',
  'commissionCPC',
  'commissionType2',
  'contactName',
  'contactEmail',
  'bannerSizeId',
  'alias',
  'extId',
  'mediatypeId',
  'placementClass'
];

// configure nunjucks
nunjucks.configure('./', {
  watch: false
});

var adPlacements = [];


/**
 * processes each raw CSV row object
 *
 * @param  {Object}  data  Object containing a row of CSV data
 *
 * @return  {Object}  The processed object
 */
var processAdPlacementConfig = function (data) {
  var filteredData = _.pick(data, [
    'websiteId',
    'websiteName',
    'siteId',
    'siteName',
    'placementId',
    'placementName',
    'placement_slot_id'
  ]);

  var sizeType = getSizeTypeForPlacement(filteredData);
  var slotName = getSlotNameForPlacement(filteredData);

  filteredData.placementType = sizeType;
  filteredData.slotName = slotName;

  return filteredData;
};

var getAdPlacementsByWebsiteId = function (collection, siteId) {
  return _.where(collection, { 'websiteId': siteId});
};


var getAdSlotsBySiteId = function (collection, siteId) {
  return _.where(collection, { 'siteId': siteId});
};


var getAdSlotsBySlotName = function (collection, placementSlotId) {
  return _.where(collection, { 'slotName': placementSlotId});
};


var getSizeTypeForPlacement = function (placement) {
  var typeRegExp = /(Mobile|Tablet|Desktop)$/i;
  var matches = typeRegExp.exec(placement.placementName);
  var sizeType = 'desktop';

  if (matches && matches.length) {
    var type = matches[0];
    sizeType = type.toLowerCase();
  }

  return sizeType;
};


var getSlotNameForPlacement = function (placement) {
  var regex = /^(Artikel|Static|Home|Ressort) ([a-zA-Z0-9\/\s]+?) (Mobile|Tablet|Desktop|Native)$/ig;
  var matches = regex.exec(placement.placementName);

  if (matches && matches.length) {
    var slot = matches[2];
    slot = toSlug(slot.replace("/", "_"));
    // ADTECH does not allow "-" in slot names
    slot = slot.replace("-", "_");
    return slot;
  } else {
    throw new Error('Naming of placement is not matching schema: ' + placement.placementName);
  }
}

var parseSiteSlots = function (siteSlots) {
  var siteIds = _.unique(_.pluck(siteSlots, 'siteId'));

  // loop through all availble siteId of current site
  var sitePageTypes = _.map(siteIds, function (siteId) {
    var slots = getAdSlotsBySiteId(siteSlots, siteId);
    var slotNames = _.unique(_.pluck(slots, 'slotName'));

    // loop through all placement slot ids and create config
    var siteTypeSlots = _.map(slotNames, function (slotName) {
      var pageTypeRegex = /^(Artikel|Static|Home|Ressort)_/ig;
      var slotName = slotName.replace(pageTypeRegex, '');
      var slot = {
        name: slotName
      };
      var placementSlots = getAdSlotsBySlotName(slots, slotName);

      // omit non needed attributes
      placementSlots = _.map(placementSlots, function (placement) {
        var placementConfig = {
          id: placement.placementId,
          //name: placement.placementName,
          type: placement.placementType
        }

        return placementConfig;
      });

      slot.placements = placementSlots;

      return slot;
    });

    return {
      "siteName": slots[0].siteName,
      "siteId": siteId,
      "slots": siteTypeSlots
    }
  });

  return sitePageTypes;
}


var parseAdPlacements = function (adSlots) {
  var siteIds = _.unique(_.pluck(adSlots, 'websiteId'));

  var allSiteSlots = _.map(siteIds, function (siteId) {
    var siteSlots = getAdPlacementsByWebsiteId(adSlots, siteId);
    var siteName = siteSlots[0].websiteName;
    var siteDomain = siteName.replace(/_([0-9]{4})/, '');
    var output = {
      websiteName: siteName,
      websiteDomain: siteDomain,
      websiteId: siteId
    }

    siteSlots = _.map(siteSlots, function (slot) {
      return _.omit(slot, ['websiteId', 'websiteName']);
    });

    // parse the siteSlots to group the placements
    siteSlots = parseSiteSlots(siteSlots);

    output.pageTypes = siteSlots;

    return output;
  });
  return allSiteSlots;
};


// Saving functions


function save(fileName, data) {
  fs.writeFile(fileName, data, function(err) {
    if(err) {
      throw new Error('error saving file', err);
    } else {
      console.log("The file %s was saved", fileName);
    }
  });
}


var saveFiles = function (adConfig) {
  // save the main config
  var output = JSON.stringify(adConfig, undefined, 2);
  save(outputPath + 'ad-config.json', output);

  // save by domain and page type
  _.each(adConfig, function (siteConfig) {
    var domain = siteConfig.websiteDomain;
    var skin = getSkinFromDomain(domain);
    if (!skin) {
      throw new Error ('no skin availble for domain "' + domain + '"');
    }

    // create a config file for each page type per skin
    _.each(siteConfig.pageTypes, function (pageType) {
      var siteName = pageType.siteName.toLowerCase();
      var pageTypeFileName = skin + '_' + siteName + '.html';
      var data = {
        adConfig: JSON.stringify(pageType)
      };
      // render into template
      var fileContent = nunjucks.render('ad-config-template.html', data);

      try {
        save(outputPath + pageTypeFileName, fileContent);
      } catch(error) {
        console.error(error);
      }
    });

  });
  console.log('saved all files');

}


// CSV parsing

var readCSV = function () {
  var parseOptions = {
    'separator': ';',
    'quote': '"',
    'escape': '"',
    'comment': '',
  };
  var reader = csv.createCsvFileReader(importFile, parseOptions);
  reader.setColumnNames(csvColumnNames);

  reader.addListener('data', function(data) {
    // skip the column names row if present
    if(adPlacements.length === 0 && data.websiteId === "Website ID") {
      return;
    }
    data = processAdPlacementConfig(data);
    adPlacements.push(data);
  });

  reader.addListener('end', function() {
    console.log('Processing %s entries', adPlacements.length);
    var adConfig = parseAdPlacements(adPlacements);

    saveFiles(adConfig);
  });
};

// start parsing
readCSV();
