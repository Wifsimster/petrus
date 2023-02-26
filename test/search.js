import { Petrus } from '../src/petrus.js'

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