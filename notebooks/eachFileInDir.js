var fs = require('fs')

// TODO: might be worth changing so that this function takes care of counting;
//       promises could be used for counter values
module.exports = (dir, counterCallback) => {
  var errorCount = 0

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      resolve(files)
    })
  }).then((files) => {
    return Promise.all(files.map((file) => {
      return new Promise((resolve, reject) => {
        fs.readFile(dir + '/' + file, 'utf8', (err, fileContent) => {
          try {
            counterCallback(fileContent, resolve)
          } catch (e) {
            errorCount++;
            resolve() // TODO: this is not nice
          }
        })
      })
    }))
  })
}
