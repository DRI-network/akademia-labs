import getTransactions from './getTransactions'
import getEvents from './getEvents'
import allStars from './contracts/allStars'

const to = allStars.address
const toAbi = allStars.abiString
const fields = ['hash', 'blockNumber', 'value', 'from', 'input']
const fileName = 'export'
function handle (data) {
  console.log('DONE')
}
// from 5087790
// to 5166472
// getEvents({
//   address: allStars.address,
//   abi: allStars.abiString,
//   eventName: 'TokenSold',
//   fromBlock: 5109502,
//   toBlock: 5166472,
// })

// fromBlock: 5087490,
// to 5166472
getTransactions({
  to,
  toAbi,
  fromBlock: 5094460,
  toBlock: 5166472,
  fields,
  fileName
}).then(handle)
