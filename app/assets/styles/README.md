# CSS Guidelines

## Structure

This folder (`/assets/stylesheets/`) only contains application-wide styles and utilities.

The `utilities/` folder contains application-wide configuration and helpers:

* `variables.scss` contains all application-wide variables
* `mixins.scss` contains all application-wide mixins
* `functions.scss` contains all application-wide functions
* `placeholders.scss` contains all application-wide placeholders

The `vendor/` folder contains third-party stylesheets. Please, only add a third-party when it is completely needed. Think of the technical debt.

The `base/` folder contains application-wide styles such as the reset stylesheet (which is a mix of Normalize.css, Meyer's reset and custom flavoured styles) and the typography baseline (including vertical rhythm rules for isntance).

Anything related to a specific component should live in the `stylesheets/` folder from the component. Variables, mixins, functions and placeholders specific to a component should lie in a `utilities/` folder in the component `stylesheets/` folder, following the same conventions as the global folder. Then, the main file from the component (`main.scss`) should include these helpers like so:

```scss
// Import the global helpers
@import 'globals';

// Import component-specific helpers
@import 'utilities/variables';
@import 'utilities/mixins';

// Component code...
```

## Naming conventions

BEM (*Block Element Modifier*) is the naming convention for the classes in the project. Note that we use the Gallagher/Roberts-flavoured BEM version, not the one from Yandex. You can [read a good introduction here](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).

*Note: a BEM selector should not contain more than a single element and a single modifier. There is a linter in place to make sure this does not happen.*

## Writing conventions

We stick to [Sass Guidelines](http://sass-guidelin.es) for the writing conventions (so basically everything but the architecture section). We also get inspired by [CSS Guidelines](http://cssguidelin.es) even if we do not stick to it to the letter. Consistency is key in any case.

Note that we use [Autoprefixer](https://github.com/postcss/autoprefixer) to automatically add relevant prefixes to our stylesheets so be sure never to prefix properties and values yourself.

## Documentation

CSS is a language full of hacks and tricks. Everything that is not obvious from the first glance should be commented. Please, assume nothing and comment your code as much as possible.

All variables, mixins, functions and placeholders should be documented with [SassDoc](http://sassdoc.com). SassDoc expects kind-of JSDoc/PHPDoc comment blocks where all lines start with 3 slashes (`///`). You can find a full list of annotations in the [documentation](http://sassdoc.com/annotations/).

## Code quality

There is a pre-commit hook running [SCSS-lint](https://github.com/brigade/scss-lint) on the codebase to make sure everything stays clean and consistent. Please, respect the linter and fix your code rather than changing the linter's rules.

## Responsive breakpoints

We use the [include-media](https://github.com/eduardoboucas/include-media) Sass library to manage responsive breakpoints; it provides a simple and friendly API to work with. Breakpoints are defined in a global `$breakpoints` map (which should never be updated dynamically).

```scss
.my-component {
  @include media('>mobile-portrait') {
    color: red;
  }

  @include media('>mobile-portrait', 'retina') {
    color: blue;
  }
}
```

If a component needs to define its own breakpoints, do it in `./views/components/COMPONENT/stylesheets/utilities/_variables.scss` and then use it safely in the `media(..)` mixin.

