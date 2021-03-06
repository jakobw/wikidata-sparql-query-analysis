const eachFileInDir = require('./eachFileInDir')
const Query = require('./Query')

module.exports = (dir, counterCallback) =>  {
  let occurences = 0
  let total = 0

  return eachFileInDir(dir, (rawQuery, resolve) => {
    const parsedQuery = parser.parse(rawQuery)
    occurences += counterCallback(new Query(rawQuery, parsedQuery)) ? 1 : 0
    total++

    resolve()
  }).then(() => {
    return occurences
  })
}
