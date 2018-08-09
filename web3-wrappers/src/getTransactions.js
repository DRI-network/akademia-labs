import { isString } from 'is-what'
import getBlocks from './utils/getBlocks'
// import { BigNumber } from 'bignumber.js'
import createProgress from './cli/progressBar'
import createCSV from './cli/csv'
const InputDataDecoder = require('ethereum-input-data-decoder')
const util = require('util')

/**
 * console.logs all transactions
 *
 * @export
 * @param {Object} {} Only accepts one object with the params below
 * @param {string} from from address
 * @param {string} to to address
 * @param {number} fromBlock the start block
 * @param {number|string} toBlock the end block, defaults to 'lastest'
 * @param {number} blockCount the amount of blocks to retrieve, defaults to 1000
 * @param {array} fields the fields to log, defaults to ['hash', 'from', 'to', 'time'] can use any param from https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransaction
 */
export default function ({
  from = '*',
  to = '*',
  toAbi,
  fromBlock,
  toBlock,
  blockCount = 1000,
  fields = ['hash', 'from', 'to', 'time'],
  fileName = 'export'
}) {
  // set from & to block
  if (!fromBlock && !toBlock) {
    toBlock = 'latest'
    fromBlock = toBlock - blockCount
  } else if (!fromBlock) {
    fromBlock = toBlock - blockCount
  } else if (!toBlock) {
    toBlock = fromBlock + blockCount
  }
  blockCount = (toBlock && fromBlock) ? toBlock - fromBlock : blockCount
  toBlock = (toBlock === 'latest') ? 'latest' : toBlock

  const progressBar = createProgress(blockCount)
  const csv = createCSV(fileName)
  const csvHeader = (fields.includes('input'))
    ? fields.filter(f => f !== 'input').concat(['input.name', 'input.types', 'input.inputs'])
    : fields
  csv.write(csvHeader)

  function txnComplies (txn) {
    const complies = (from === '*' || from === txn.from) &&
      (to === '*' || to === txn.to)
    return complies
  }

  // start
  console.log(`Searching for transactions
  from: ${from}
  to: ${to}
  fromBlock: ${fromBlock}
  toBlock: ${toBlock}
  blockCount: ${blockCount}
  FIELDS: ${fields}`)

  return new Promise((resolve, reject) => {
    const allTransactions = []
    let atBlock = fromBlock

    function pushRow (row) {
      allTransactions.push(row)
      const csvRow = row.map(cell => {
        if (isString(cell)) return cell.replace('\'', '')
        return util.inspect(cell)
      })
      csv.write(csvRow)
    }

    function incrementBlock () {
      atBlock++
      console.log('atBlock #', atBlock)
      progressBar.tick()
      if (atBlock === toBlock) {
        // csv.end()
        return resolve(allTransactions)
      }
    }

    function getTxnArray (txn, block) {
      console.log('found transaction!')
      return fields.reduce((carry, f) => {
        if (f === 'time') {
          carry.push(`${block.timestamp} ${new Date(block.timestamp * 1000).toGMTString()}`)
          return carry
        }
        // if (f === 'input') return web3.utils.hexToAscii(txn[f])
        if (f === 'input' && toAbi) {
          const abi = (isString(toAbi)) ? JSON.parse(toAbi) : toAbi
          const decoder = new InputDataDecoder(abi)
          const inputData = decoder.decodeData(txn.input)
          carry.push(inputData.name)
          carry.push(inputData.types)
          carry.push(inputData.inputs.map(input => {
            // if (BigNumber.isBigNumber(input)) return input.toNumber()
            return input.toString().replace('\n', '')
          }))
          return carry
        }
        carry.push(txn[f])
        return carry
      }, [])
    }

    function pushBlockResults (blockObj) {
      if (blockObj && blockObj.transactions && blockObj.transactions.length) {
        blockObj.transactions.forEach(txn => {
          if (txnComplies(txn)) {
            let row = getTxnArray(txn, blockObj)
            pushRow(row)
          }
        })
        return incrementBlock()
      }
    }

    function handleBlocks (blocks) {
      blocks.forEach(pushBlockResults)
    }

    getBlocks(fromBlock, toBlock, handleBlocks)
  })
}
