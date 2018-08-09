const fs = require('fs')
const csv = require('fast-csv')

export default function (fileName) {
  const csvStream = csv.createWriteStream({headers: true})
  const writableStream = fs.createWriteStream(`${fileName}.csv`)
  writableStream.on('finish', _ => {
    console.log('Wrote everything to CSV!')
  })
  csvStream.pipe(writableStream)
  return csvStream
}
