# AZ Medien

## Setup

```sh
# Install Gulp globally
$ npm install gulp -g

# Install SCSS-lint globally
$ gem install scss_lint

# Install project Node dependencies
$ npm install
```

If you get errors when running any tasks (Error: Syntax error: Invalid US-ASCII character "\xC3" or similar) then try to set the default encoding in your environment vars:
```
export LC_CTYPE="en_US.UTF-8"
```

## Development

### Styleguide

When working in the styleguide, on http://localhost:8000

```sh
$ gulp assets
$ gulp
```
---------------------------

### Components

#### jQuery

We are aiming towards a jQuery independent architecture and *jQuery should never be used in React components*. Note that [Lodash](https://lodash.com/docs) is included as a utility library which is much smaller and can be used to replace a lot of common jQuery functions. Be aware below IE9 is not supported which also removes a lot of the need for jQuery.

##### Current exceptions

- jQuery is included in the `ArticleBody` component (on the article page) served via request from Google CDN. It's placed before any enrichments are loaded which ensures all legacy HTML snippets will work (e.g. Watson content box) on all articles. Eventually, snippets of this kind from older articles should aim to be phased out.
- The [Flickity](http://flickity.metafizzy.co/) library which is used for the `ImageGallery` component and `Slider` mixin has a jQuery dependency. We will look at removing this dependency in the future.
- The `Video` module also uses some jQuery functions which we will also look to remove in the future.


---------------------------

### Back-end

When working with back-end integration, on http://localhost:8801.


```sh
$ gulp assets --production
$ gulp --production
```

For full documentation of setting up this local development environment please see [localdev](localdev).

### Note

`gulp assets` compiles static assets to save them being compiled on every watch. Do this once, every time you start developing or update something in `/assets`.

## API

We use the Lovely Systems API for recieving data. Documentation can be found here:
http://api-azdev.lovelysystems.com/docs/

## Branching

We use the [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow/) branching model. `master` **always** contains the current, tested live version.

When working, create feature branches off `develop` in the form `feature/8-story-name` where `8` is the user story number and `story-name` is the name of the user story (both from ScrumDo).

### Update the release notes when finishing feature branches

When a feature branch is closed and merged into `develop` add the changes/new features in `/CHANGES.txt` under the the `unreleased` block. This gives a clear overview what will go into the next release and has to be tested.

```
======================
Changes for az-nwch-js
======================

unreleased
==========

- add your changes here

```

## Code Quality

Before committing, code will be linted using `eslint` (JS/JSX) and `scss-lint` (Scss). You will not be able to commit unless your code passes linting. To make life easier, use plugins for your text editor to highlight any errors as you go e.g.

- [Sublime​Linter](https://packagecontrol.io/packages/SublimeLinter)
- [SublimeLinter-scss-lint](https://packagecontrol.io/packages/SublimeLinter-contrib-scss-lint)
- [Sublime​Linter-contrib-eslint](https://packagecontrol.io/packages/SublimeLinter-contrib-eslint)

You might also find the following useful for this project:

- [babel-sublime](https://github.com/babel/babel-sublime)


## Living Styleguide Deployment

The styleguide is hosted on [Heroku](http://az-nwch.herokuapp.com/styleguide).

Before you can deploy please check that you have a working Heroku setup on your machine:
- Create a Heroku account if necessary
- Install the [Heroku toolbelt](https://toolbelt.heroku.com/) and follow the instructions

Check that you have access to the Heroku app (ask Phillip or Dennis) then add a Heroku remote to your repository.

```sh
$ git remote add heroku git@heroku.com:az-nwch.git
```

For reference, we are using [this buildpack](https://github.com/robgraeber/heroku-buildpack-nodejs-bower-gulp) for Node / Gulp configuration.

To deploy, the following command will deploy from the `develop` branch

```sh
$ git push heroku develop:master
```

If you want to deploy from a specific/feature branch, use:

```sh
$ git push heroku branchname:master
```

## Lovely Systems Deployment

Currently the deployment is made using git checkout from branch "release/0.0".

To prepare the current develop branch for deployement use these commands::

```sh
$ git checkout develop
$ git pull
$ git checkout release/0.0
$ git merge develop
$ npm version patch
$ git push origin
```
