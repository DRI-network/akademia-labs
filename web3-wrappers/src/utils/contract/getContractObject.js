import { isString } from 'is-what'
import web3 from '../../web3'

/**
 * Takes info on a smart contract and returns the object to be used with web3
 *
 * @param {string} address the contract address
 * @param {string|JSON} abiString the abi as a string or JSON object
 */
export default function (address, abi) {
  abi = (isString(abi)) ? JSON.parse(abi) : abi
  if (!address || !abi) return console.error('missing parameters...')
  return new web3.eth.Contract(abi, address)
}
