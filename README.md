# Petrus

A JavaScript library that can simply search and grab magnet link from The Pirate Bay :anchor: (or TPB clones).

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Wifsimster/petrus/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/petrus.svg)](https://www.npmjs.com/package/petrus)
[![Install size](https://packagephobia.now.sh/badge?p=petrus)](https://packagephobia.now.sh/result?p=petrus)

## Install

```
$ npm install petrus
```

## Usage

```js
const Petrus = require("petrus")

Petrus.search("Final Space S01E01")
  .then(results => {
    console.log(results)
  })
  .catch(err => {
    console.error(err)
  })
```

## Documentation

#### search([query], [category])

- `query` `<string>` Query to search
- `category` `<string>` Optional, precise the category to search. Default is all categories. [`Music`, `Movies`, `TV shows`, `HD - Movies`, `HD - TV shows`]

Response is a list of object : `[{ magnetLink, name, quality, seeder, size, uploaded }]`
