import { isString } from 'is-what'
import web3 from '../../web3'

/**
 * Get the event selector
 *
 * @export
 * @param {string} name event name
 * @param {array} fields event field types as strings. eg. ['uint256','address','string']
 * @return {string} the event selector hash
 */
function getEventSelector (name, fields) {
  const eventAbs = `${name}(${fields.join()})`
  const eventHash = web3.utils.sha3(eventAbs)
  return eventHash
}

/**
 * Get event selectors for an object of events
 *
 * @param {object} eventsObject Requires an object with each eventName as prop and as value an array of [fields], where each field is a string with the variable *type*
 * @returns {object} An object with each eventName as prop and as value: {name, fields, selector}
 */
export default function (abi) {
  abi = (isString(abi)) ? JSON.parse(abi) : abi
  const events = abi.filter(o => o.type === 'event')
  return events
    .reduce((carry, event) => {
      const name = event.name
      const fields = event.inputs
        .reduce((carry, input) => {
          carry[input.name] = input
          return carry
        }, {})
      carry[name] = {
        name,
        fields,
        // selector: getEventSelector(name, fields)
      }
      return carry
    }, {})
}
