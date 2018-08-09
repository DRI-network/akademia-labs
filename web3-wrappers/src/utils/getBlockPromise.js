import web3 from '../web3'

// https://web3js.readthedocs.io/en/1.0/web3-eth.html#getblock

export default function (i, getTransactions = true) {
  return new Promise((resolve, reject) => {
    function handle (error, result) {
      if (error) reject(error)
      resolve(result)
    }
    web3.eth.getBlock(i, getTransactions, handle)
  })
}
