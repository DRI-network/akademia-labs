const Web3 = require('web3')

const infuraWsUrl = 'wss://mainnet.infura.io/ws'
const infuraWs = new Web3.providers.WebsocketProvider(infuraWsUrl)
const web3 = new Web3(infuraWs)

export default web3
