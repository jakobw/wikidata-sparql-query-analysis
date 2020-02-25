const fs = require('fs')
const sparqljs = require('sparqljs')
const prefixes = require('../notebooks/namespaces')

const queriesDir = __dirname + '/all'

new Promise((resolve, reject) => {
    fs.readdir(queriesDir, (err, files) => {
        resolve(files)
    })
}).then((files) => {
    return Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
            fs.readFile(queriesDir + '/' + file, 'utf8', (err, fileContent) => {
                resolve(fileContent)
            })
        })
    }))
}).then((fileContents) => {
    console.log(fileContents.length)
    const queries = fileContents.map((query) => {
        try {
            const parsedQuery = (new sparqljs.Parser({ prefixes })).parse(query)
            return (new sparqljs.Generator()).stringify(parsedQuery)
        } catch (e) {
            return false
        }
    }).filter(id => id)
    .map((query) => {
        // replace Q-ids
        // replace P-ids
    })
    console.log(queries.length)
    console.log(queries[0], queries[1], queries[2])
})
        

// Step 1: create directories for each cluster
// for each file in dir
    // read to string
    // sparql parse and stringify (idea: get only actual queries, also whitespace and whatnot)
    // replace item ids with Q666
    // replace property ids with P777

// for each query
    // take first query
    // create dir
    // for each query calculate edit distance
    // if edit distance <= threshold
        // move (! because we don't want the same query in multiple clusters) query into dir

// Step 2: get 1 representative of each cluster
// for each dir
    // take 1 query and copy it into some folder
