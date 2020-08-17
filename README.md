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
import { Petrus } from 'petrus'

async function main() {
  let petrus = new Petrus()

  let data = await petrus
    .search('Final Space S01E01')
    .catch(err => { console.error(err) })

  if(data) {
    console.log(data)
  }
}

main()
```

## Documentation

#### Petrus([url])

- `url` `<string>` Hostname to load, default is : `https://thepiratebay.org`

Instantiate a new `Petrus` class.


#### search([query], [category])

- `query` `<string>` Query to search
- `category` `<string>` Optional, precise the category to search. Default is all categories. [`Music`, `Movies`, `TV shows`, `HD - Movies`, `HD - TV shows`]

Response is a list of object : `[{ magnetLink, name, quality, seeder, size, uploaded }]`
