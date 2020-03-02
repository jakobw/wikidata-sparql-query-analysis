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

    const clusters = []
    const clusterCounts = []

    queries.forEach((query, i) => {
        console.log(`clustered ${i}, number of clusters: ${clusters.length}`)
        let clustered = false
        for (let i = 0; i < clusters.length; i++) {
            if (levenshtein(clusters[i], query) <= LEVENSHTEIN_THRESHOLD) {
                fs.writeFileSync(queriesTargetDir + `/${i}_${clusterCounts[i]}.txt`, query)
                clustered = true
                clusterCounts[i]++
                break
            }
        }

        if (!clustered) {
            fs.writeFile(queriesTargetDir + `/${clusters.length}_base.txt`, query, (err) => {
                if (err) console.log('sad')
            })
            clusters.push(query)
            clusterCounts.push(0)
        }
    })
})
