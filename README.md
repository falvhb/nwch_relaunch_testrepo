# az-nwch-js

## Setup

```sh
# Install Gulp globally
$ npm install gulp -g

# Install SCSS-lint globally
$ gem install scss-lint

# Install project Node dependencies
$ npm install
```

## Development

```sh
$ gulp
```

If you have the [LiveReload browser extension](http://livereload.com/extensions/), feel free to pass the `--livereload` flag to benefit from instant page reloading on change i.e.


```sh
$ gulp --livereload
```

## Deployment

Check you have access to the Heroku app (ask Moritz) then add a Heroku remote to your repository.

```sh
$ git remote add heroku git@heroku.com:az-nwch.git
```

For reference, we are using [this buildpack](https://github.com/robgraeber/heroku-buildpack-nodejs-bower-gulp) for Node / Gulp configuration.

To deploy, the following command will deploy from the `master` branch

```sh
$ git push heroku master
```

If you want to deploy from a specific/feature branch, use:

```sh
$ git push heroku branchname:master
```
