# Petrus

A JavaScript library that can simply grab magnet link from The Pirate Bay and add it to Transmission :anchor:.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Wifsimster/petrus/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/petrus.svg)](https://www.npmjs.com/package/petrus)

**Core Features**

- Search a list of shows on TPB;
- Extract the best magnet link avaible on the first page;
- Add the magnet link to your Transmission server.

**Quick start**

```javascript
npm install petrus
```

```javascript
const Petrus = require("petrus")

// Define Transmission config
const petrus = new Petrus({
  host: `127.0.0.1`,
  port: `9091`,
  username: ``,
  password: ``
})

// Return a promise
petrus.run([`show_01`, `show_02`])
```

That's all :)
