const ProgressBar = require('ascii-progress')

export default function (tickAmount) {
  return new ProgressBar({
    total: tickAmount,
    schema: ':bar.gradient(#312094,#F445A8)  :current/:total :percent time: :elapseds ETA: :etas',
    blank: '░',
    filled: '█'
  })
}
