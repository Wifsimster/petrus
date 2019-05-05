/*
 * Petrus
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 */

const puppeteer = require("puppeteer")
const Transmission = require("transmission")

module.exports = class {
  constructor(config) {
    this.transmission = new Transmission(config)
  }

  async run(shows) {
    if (shows && shows.length > 0) {
      shows.map(async show => {
        const magnetUrl = await this.getMagnetLink(show)

        if (magnetUrl) {
          const download = await this.addMagnetLink(magnetUrl)
          if (download && download.id) {
            console.log(download)
          } else {
            console.error(`Magnet link was not added to Transmission !`)
          }
        } else {
          console.error(`No magnet link found for "${show}"`)
        }
      })
    } else {
      console.error(`No show found !`)
    }
  }

  addMagnetLink(magnetLink) {
    return new Promise((resolve, reject) => {
      if (this.transmission) {
        this.transmission.addUrl(magnetLink, (err, arg) => {
          if (!err) {
            resolve(arg)
          } else {
            reject(err)
          }
        })
      } else {
        reject(`Transmission couldn't connect !)`)
      }
    })
  }

  async getMagnetLink(query) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const showQuery = encodeURIComponent(query)

      await page.goto(`https://thepiratebay.org/search/${showQuery}/0/7/0`) // Order by Seeder

      const rows = await page.$$eval(`#searchResult > tbody > tr`, elements => {
        return elements.map(el => {
          return el.innerHTML
        })
      })

      await browser.close()

      const downloads = this.parseInfo(rows)

      const bestDownload = this.getBestPossibleDownload(downloads)

      if (bestDownload) {
        return bestDownload.magnet
      }

      return null
    } catch (err) {
      console.error(err)
    }
  }

  getBestPossibleDownload(downloads) {
    for (let i = 0; i < downloads.length; i++) {
      if (
        typeof downloads === `object` &&
        downloads[i] &&
        downloads[i].name &&
        /season/i.exec(downloads[i].name) === null
      ) {
        return downloads[i]
      }
    }
    return null
  }

  parseInfo(rows) {
    return rows.map(row => {
      let matchMagnetLink = /href="(magnet:[\S]+)"\s/g.exec(row)
      let matchTvShowQuality = /href="\/browse\/205[\S]*"/g.exec(row)
      let matchHdTvShowQuality = /href="\/browse\/208[\S]*"/g.exec(row)
      let matchDate = /<font class="[\s\S]+">Uploaded ([\s\S]+)&nbsp;\d/g.exec(
        row
      )
      let matchSize = /<font class="[\s\S]+">[\s\S]+Size ([\s\S]+)&nbsp;([\s\S]+),/g.exec(
        row
      )
      let matchSeeder = /<td align="right">([\d]+)<\/td>/.exec(row)
      let matchName = /href="\/torrent\/[\d]+\/([\S]+)"/.exec(row)

      // Return only `Tv Shows` or `HD - Tv Shows`
      if (matchHdTvShowQuality || matchTvShowQuality) {
        return {
          magnet: matchMagnetLink
            ? matchMagnetLink[1].replace(`&amp;`, `&`)
            : null,
          quality: matchHdTvShowQuality ? `HD` : `SD`,
          name: matchName ? matchName[1] : null,
          uploaded: matchDate ? matchDate[1] : null,
          size: matchSize ? `${matchSize[1]} ${matchSize[2]}` : null,
          seeder: matchSeeder ? parseInt(matchSeeder[1]) : null
        }
      }
    })
  }
}
