# Advertising setup

For advertising ADTECH is used for delivering the ads to the different ad slots.

The new setup is using server side includes (SSI) to place the JS configuration of each page into the `<head>` tag of the document.

For each domain there are currently 4 types of pages:

* Artikel
* Home
* Ressort
* Static

Each of these page types has an unique `siteId` per domain which is used to map to the proper ad configuration.


## Creating the configuration files

To generate the files for the advertising configuration you need to follow these steps

1) ADTECH CSV export

Go to the ADTECH website and export the settings for all news sites as a CSV file.

These sites are:
* grenchnertagblatt.ch_2015
* bzbasel.ch_2015
* solothurnerzeitung.ch_2015
* basellandschaftlichezeitung.ch_2015
* oltnertagblatt.ch_2015
* aargauerzeitung.ch_2015
* limmattalerzeitung.ch_2015
* badenertagblatt.ch_2015

Save the CSV file in `scripts/az-banners-all-sites.csv` (overwriting the existing file).

2) Run the Node.js script to create config files

`cd scripts`
`node ./generate-ad-config.js`

This will generate a bunch of .html files under `/app/assets/includes/advertising/`.

3) Copy the generated files to `/client` folder

`gulp assets --prod`

To copy the includes to `/client/includes/advertising`.  These are then included by SSI

