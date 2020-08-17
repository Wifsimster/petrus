import { Petrus } from '../src/petrus.js'

async function main() {
  let petrus = new Petrus()

  let data = await petrus
    .search('Final Space')
    .catch(err => { console.error(err) })

  if(data) {
    console.log(data)
  }
}

main()