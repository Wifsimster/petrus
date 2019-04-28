/*
 * Petrus
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 */

const puppeteer = require("puppeteer")
const Transmission = require("transmission")

const config = require("./transmission-config")
const shows = require(`./shows`)

module.exports = class {
  constructor() {}

  static async run() {
    shows.map(async show => {
      const magnetUrl = await this.getMagnetLink(show.name)

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
  }

  static addMagnetLink(magnetLink) {
    return new Promise((resolve, reject) => {
      const transmission = new Transmission(config)

      if (transmission) {
        transmission.addUrl(magnetLink, (err, arg) => {
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

  static async getMagnetLink(query) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const showQuery = encodeURIComponent(query)
    await page.goto(`https://thepiratebay.org/search/${showQuery}/0/99/208`)
    // await page.goto(`https://thepiratebay.org/search/${showQuery}/0/99/205`)
    const element = await page.$('[href*="magnet:"]')
    const href = await page.evaluate(e => e.href, element)
    await browser.close()
    return href

    // TODO : Need to be sure magnet link is an episode and not a compilation/season
  }
}
