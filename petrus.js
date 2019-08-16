/*
 * Petrus
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 */

const https = require("https")

const { JSDOM } = require("jsdom")

module.exports = class {
  constructor() {}

  static async search(query) {
    const rows = await this.scrap(query)
    return this.parseInfo(rows)
  }

  static async scrap(query) {
    return new Promise((resolve, reject) => {
      const showQuery = encodeURIComponent(query)

      https.get(`https://thepiratebay.org/search/${showQuery}/0/7/0`, response => {
        const { statusCode, statusMessage } = response

        if (statusCode >= 400) {
          reject({ code: statusCode, message: statusMessage })
        } else {
          let data = ""

          response.on("data", chunk => {
            data += chunk
          })

          response.on("end", () => {
            const fragment = JSDOM.fragment(data)
            const selector = fragment.querySelectorAll("tr")
            var array = []

            for (var i = 0; i < selector.length; i++) {
              array.push(selector[i].innerHTML)
            }

            resolve(array)
          })
        }
      })
    })
  }

  static async getBestEpisode(query) {
    const downloads = await this.search(query)

    const bestDownload = this.getBestPossibleDownload(downloads)

    if (bestDownload) {
      return bestDownload
    }

    return null
  }

  static getBestPossibleDownload(downloads) {
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

  static parseInfo(rows) {
    var results = rows.map(row => {
      let matchMagnetLink = /href="(magnet:[\S]+)"\s/g.exec(row)
      let matchTvShowQuality = /href="\/browse\/205[\S]*"/g.exec(row)
      let matchHdTvShowQuality = /href="\/browse\/208[\S]*"/g.exec(row)
      let matchDate = /<font class="[\s\S]+">Uploaded ([\s\S]+)&nbsp;\d/g.exec(row)
      let matchSize = /<font class="[\s\S]+">[\s\S]+Size ([\s\S]+)&nbsp;([\s\S]+),/g.exec(row)
      let matchSeeder = /<td align="right">([\d]+)<\/td>/.exec(row)
      let matchName = /href="\/torrent\/[\d]+\/([\S]+)"/.exec(row)

      // Return only `Tv Shows` or `HD - Tv Shows`
      if (matchHdTvShowQuality || matchTvShowQuality) {
        return {
          magnet: matchMagnetLink ? matchMagnetLink[1].replace(`&amp;`, `&`) : null,
          quality: matchHdTvShowQuality ? `HD` : `SD`,
          name: matchName ? matchName[1] : null,
          uploaded: matchDate ? matchDate[1] : null,
          size: matchSize ? `${matchSize[1]} ${matchSize[2]}` : null,
          seeder: matchSeeder ? parseInt(matchSeeder[1]) : null
        }
      }
    })

    return results.filter(i => i)
  }
}
