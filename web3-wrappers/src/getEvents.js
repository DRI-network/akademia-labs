import getEventInfo from './utils/contract/getEventInfo'
import getContractObject from './utils/contract/getContractObject'

import createProgress from './cli/progressBar'
import createCSV from './cli/csv'

// options:
// filter - Object (optional): Lets you filter events by indexed parameters, e.g. {filter: {myNumber: [12,13]}} means all events where “myNumber” is 12 or 13.
// fromBlock - Number (optional): The block number from which to get events on.
// toBlock - Number (optional): The block number to get events up to (Defaults to "latest").
// topics - Array (optional): This allows manually setting the topics for the event filter. If given the filter property and event signature, (topic[0]) will not be set automatically.
// https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html?highlight=events#getpastevents

/**
 *
 *
 * @param {object} {
 *   {string} address,
 *   {string} abi,
 *   {string} eventName,
 *   filter,
 *   {Number} fromBlock,
 *   {Number} toBlock,
 *   topics
 * }
 * @returns {Promise}
 */
function getEvents ({address, abi, eventName, filter, fromBlock, toBlock, topics}) {
  const contract = getContractObject(address, abi)
  const allEvents = getEventInfo(abi)
  const eventInfo = allEvents[eventName]
  if (!eventInfo) return Error('The event does not exist on this contract. Please double check the abi.')

  return new Promise((resolve, reject) => {
    contract.getPastEvents(eventName, {fromBlock, toBlock}).then(events => {
      events = events.map(event => {
        const fields = Object.keys(event.returnValues).reduce((carry, eventKey) => {
          if (eventInfo.fields[eventKey]) carry[eventKey] = event.returnValues[eventKey]
          return carry
        }, {})
        return Object.assign({blockHash: event.blockHash, blockNumber: event.blockNumber}, fields, event)
      })
      resolve(events)
    }).catch(error => {
      console.error('error → ', error)
      Error(error)
      reject(error)
    })
  })
}

/**
 *
 *
 * @export
 * @param {object} {
 *   {string} address,
 *   {string} abi,
 *   {string} eventName,
 *   filter,
 *   {Number} fromBlock,
 *   {Number} toBlock,
 *   topics
 * }
 * @returns {Promise}
 */
export default function ({
  address,
  abi,
  eventName,
  filter,
  fromBlock,
  toBlock,
  topics,
  fileName = 'export'
}) {
  const progressBar = createProgress((toBlock - fromBlock) / 100)
  const csv = createCSV(fileName)
  let firstBlockEventsPromise = getEvents({
    address,
    abi,
    eventName,
    filter,
    fromBlock,
    toBlock: fromBlock + 1000,
    topics
  })
  // Get first block with event to create the header for the CSV
  firstBlockEventsPromise.then(firstBlockEvents => {
    const csvHeader = (Object.keys(firstBlockEvents[0]))
    csv.write(csvHeader)
    let i = fromBlock
    while (i <= toBlock) {
      let i2 = i + 100
      const eventsPromise = getEvents({
        address,
        abi,
        eventName,
        filter,
        fromBlock: i,
        toBlock: i2,
        topics
      })
      eventsPromise.then(events => {
        if (events.length) {
          events.forEach(event => {
            const row = csvHeader.map(column => event[column])
            csv.write(row)
          })
        }
      })
      i = i2
      progressBar.tick()
    }
  })
}
