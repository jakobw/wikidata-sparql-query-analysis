const fs = require('fs')
const sparqljs = require('sparqljs')
const levenshtein = require('js-levenshtein')
const prefixes = require('../notebooks/namespaces')

const LEVENSHTEIN_THRESHOLD = 5

const queriesSourceDir = __dirname + '/all'
const queriesTargetDir = __dirname + '/normalized'

new Promise((resolve, reject) => {
    fs.readdir(queriesSourceDir, (err, files) => {
        resolve(files)
    })
}).then((files) => {
    return files.map((file) => {
        return fs.readFileSync(queriesSourceDir + '/' + file, 'utf8')
    })
}).then((fileContents) => {
    console.log(fileContents.length)
    let queries = fileContents.map((query) => {
        try {
            const parsedQuery = (new sparqljs.Parser({ prefixes })).parse(query)
            return (new sparqljs.Generator()).stringify(parsedQuery)
        } catch (e) {
            return false
        }
    }).filter(id => id)
    .map((query) => {
        return query.replace(/\:P\d+/g, ':P777')
            .replace(/\:Q\d+/g, ':Q666')
    })
    console.log(`${queries.length} valid queries to cluster`)

    let clusterCount = 0
    while (queries.length > 0) {
        console.log(queries.length)
        const leftovers = []
        const baseQuery = queries.pop()
        fs.writeFile(queriesTargetDir + `/${clusterCount}_base.txt`, baseQuery, (err) => {
            if (err) console.log('sad')
        })
        let queriesClustered = 0
        queries.forEach((query, i) => {
            if (levenshtein(baseQuery, query) <= LEVENSHTEIN_THRESHOLD) {
                fs.writeFile(queriesTargetDir + `/${clusterCount}_${queriesClustered}.txt`, query, (err) => {
                    if (err) console.log('sad')
                })
                queriesClustered++
            } else {
                leftovers.push(query)
            }
        })
        clusterCount++
        queries = leftovers
    }
})
