const eachFileInDir = require('./eachFileInDir')

module.exports = (dir, counterCallback) =>  {
  let occurences = 0
  let total = 0

  eachFileInDir(dir, (rawQuery, resolve) => {
    const parsedQuery = parser.parse(rawQuery)
    occurences += counterCallback(parsedQuery, rawQuery) ? 1 : 0
    total++

    resolve()
  }).then(() => {
    console.log(dir, total, occurences)
  })
}
