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

## Development

```sh
$ gulp assets
$ gulp
```

`$gulp assets` compiles static assets to save them being compiled on every watch. Do this once, when you start developing or upate something in `/assets`.

## Branching

We use the [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow/) branching model. `master` **always** contains the current, tested live version.

When working, create feature branches off `develop` in the form `feature/8-story-name` where `8` is the user story number and `story-name` is the name of the user story (both from ScrumDo).

## Code Quality

Before committing, code will be linted using `eslint` (JS/JSX) and `scss-lint` (Scss). You will not be able to commit unless your code passes linting. To make life easier, use plugins for your text editor to highlight any errors as you go e.g.

- [Sublime​Linter](https://packagecontrol.io/packages/SublimeLinter)
- [SublimeLinter-scss-lint](https://packagecontrol.io/packages/SublimeLinter-contrib-scss-lint)
- [Sublime​Linter-contrib-eslint](https://packagecontrol.io/packages/SublimeLinter-contrib-eslint)

You might also find the following useful for this project:

- [babel-sublime](https://github.com/babel/babel-sublime)


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
