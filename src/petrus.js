/*
 * Petrus
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 */
import puppeteer from 'puppeteer'

class Petrus {
	/**
  * Some exemples : 
  * https://thepiratebay.org
  * https://thepiratebays.info
  * https://thepirate-bay.org/home/
  */
	constructor(url = 'https://thepiratebay.org') {
		this.baseUrl = url
	} 

	getBaseUrl() {
		return this.baseUrl
	}

	async search(query) {
		return await this.scrap(query)
	}

	getCategory(val) {
		switch (val) {
		case 'Music':
			return '101'
		case 'Movies':
			return '201'
		case 'TV shows':
			return '205'
		case 'HD - Movies':
			return '207'
		case 'HD - TV shows':
			return '208'
		default:
			return '0'
		}
	}

	async scrap(query, category) {
		// return new Promise((resolve, reject) => {
		let showQuery = encodeURIComponent(query)
		let categoryURL = this.getCategory(category)
      
		let url = `${this.getBaseUrl()}/search/${showQuery}/${categoryURL}`
    
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(url)

		const selector = '#torrents li.list-entry'
		await page.waitForSelector(selector)

		const links = await page.evaluate(selector => {
			const items = Array.from(document.querySelectorAll(selector))
			return items.map(item => {
				return { 
					category: item.children[0].innerText,
					name: item.children[1].innerText,
					uploaded: item.children[2].innerText,
					magnetLink: item.children[3].children[0].href,
					size: item.children[4].innerText,
					seeders: parseInt(item.children[5].innerText),
					leechers: parseInt(item.children[6].innerText),
					author: item.children[7].innerText
				}
			})
		}, selector)

		await browser.close()

		return links
	}
}

export { Petrus }
export default Petrus