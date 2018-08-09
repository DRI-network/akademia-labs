import getBlock from './getBlockPromise'

function numbersAsArray (startNumber, endNumber) {
  const array = []
  while (startNumber <= endNumber) {
    array.push(startNumber)
    startNumber++
  }
  return array
}

async function parallelPromises (targets, handle, handleSecondParam) {
  let promises = []
  for (let i = 0; i < targets.length; i++) {
    promises.push(handle(targets[i], handleSecondParam))
  }
  const results = await Promise.all(promises)
  return results
}

function handleBlockBatches (fromBlock, toBlock, callback, getTransactions, throttleAmount) {
  const targetBlocks = numbersAsArray(fromBlock, fromBlock + throttleAmount)
  parallelPromises(targetBlocks, getBlock, getTransactions)
    .then(result => {
      callback(result)
      if (fromBlock < toBlock) {
        handleBlockBatches(targetBlocks.pop() + 1, toBlock, callback, getTransactions, throttleAmount)
      }
    })
    .catch(console.error)
}

export default function (fromBlock, toBlock, callback, getTransactions = true, throttleAmount = 1) {
  handleBlockBatches(fromBlock, toBlock, callback, getTransactions, throttleAmount)
}
