const propertyDataTypeMapping = require('./propertyDataTypeMapping');

function isValidQuery(query) {
    return true // will internally throw an exception when parsed
}
function hasOptional(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'optional'
    }, false)
}
function hasFilter(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'filter'
    }, false)
}
function hasOrderBy(query) {
    return query.getParsed().order
}
function hasDistinct(query) {
    return query.getParsed().distinct
}
function hasGroupBy(query) {
    return query.getParsed().group
}
function hasValues(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'values'
    }, false)
}
function hasUnion(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'union'
    }, false)
}
function hasNotExist(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.operator === 'notexists'
    }, false)
}
function hasBind(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'bind'
    }, false)
}
function hasMinus(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.notLeaf && node.type === 'minus'
    }, false)
}
function hasSubQuery(query) {
    return query.traverse().reduce(function(acc, node) {
        return acc || this.level > 0 && this.notLeaf && node.type === 'query'
    }, false)
}
function hasPropertyPath(query) {
    return query.getPredicates().some(predicate => predicate.type === 'path')
}

// shapes
function hasPath(query) {
    const objects = query.getObjects()

    return query.getSubjects().some((subject) => {
        return typeof subject === 'string' && subject.startsWith('?') && objects.includes(subject)
    })
}
function hasSink(query) {
    const objectCounts = _.countBy(query.getObjects(), _.identity)
    return _.size(_.pickBy(objectCounts, (count, obj) => count > 1 && _.startsWith(obj, '?'))) > 0
}
function hasSource(query) {
    const subjectCounts = _.countBy(query.getSubjects(), _.identity)
    return _.size(_.pickBy(subjectCounts, (count, subj) => count > 1 && _.startsWith(subj, '?'))) > 0
}
function transitive(graph) { // silly
    do {
        var change = false

        for (var subject in graph) {
            var subjectReachability = graph[subject]
            for (var i = 0; i < graph[subject].length; i++) {
                if (graph[graph[subject][i]]) {
                    subjectReachability = subjectReachability.concat(graph[graph[subject][i]])
                }
            }
            if (_.uniq(subjectReachability).length > graph[subject].length) {
                change = true
                graph[subject] = _.uniq(subjectReachability)
            }
        }
    } while (change)

    return graph
}

function hasCycles(graph) {
    for (var subject in graph) {
        if (graph[subject].includes(subject)) return true
    }
    return false
}

function hasCycle(query) {
    var reachability = query.traverse().reduce((acc, node) => {
        if (node.subject && node.object.startsWith('?')) {
            if (!acc[node.subject]) acc[node.subject] = []
            acc[node.subject].push(node.object)
        }

        return acc
    }, {})

    return hasCycles(transitive(reachability))
}

// concrete Item
function hasURISubject(query) {
    return query.getSubjects().some(subject => subject.startsWith('http://www.wikidata.org/entity/Q'))
}

// Property paths
function getPropertyPathPredicates(wiki) {
    var predicates = []

    return eachFileInDir(wiki, (query, resolve) => {
        var query = new Query(query, parser.parse(query))

        predicates = traverse(query.getPredicates().filter(predicate => predicate.type === 'path')).reduce((acc, node) => {
            if (typeof node === 'string' && node.includes('prop/direct/P')) {
                acc.push(node)
            }

            return acc
        }, predicates)

        resolve()
    }).then(() => {
        return _.countBy(predicates, _.identity)
    })
}

function getPropertiesPerQuery(wiki) {
    var predicates = []

    return eachFileInDir(wiki, (query, resolve) => {
        var query = new Query(query, parser.parse(query))

        predicates = predicates.concat(getPredicatePropertyIds(query))

        resolve()
    }).then(() => {
        return _.countBy(predicates, _.identity)
    })
}

function getPredicatePropertyIds(query) {
    return traverse(query.getPredicates()).reduce((acc, node) => {
        if (typeof node === 'string' && node.includes('prop/direct/P')) {
            acc.push(node.substr(36))
        }

        return acc
    }, [])
}

function getDatatypesPerQuery(wiki) {
    var dataTypes = []

    return eachFileInDir(wiki, (query, resolve) => {
        var query = new Query(query, parser.parse(query))

        dataTypes = traverse(query.getPredicates()).reduce((acc, node) => {
            if (typeof node === 'string' && node.includes('prop/direct/P')) {
                const propertyId = node.substr(36)
                if (propertyDataTypeMapping[propertyId]) {
                    acc.push(propertyDataTypeMapping[propertyId])
                }
            }

            return acc
        }, dataTypes)

        resolve()
    }).then(() => {
        return _.countBy(dataTypes, _.identity)
    })
}

function canBeBuiltWithDatatypes(types) {
    return function (query) {
        const dataTypes = getPredicatePropertyIds(query).map(p => {
            return propertyDataTypeMapping[p] || p
        })

        return (new Set([...types, ...dataTypes])).size === types.length // subset test
    }
}

// Wikidata features
function hasQualifiers(query) {
    return query.getRaw().includes('pq:P')
}
function hasReferences(query) {
    return query.getRaw().includes('pr:P')
}
function hasSitelinks(query) {
    return query.getRaw().includes('schema:about')
}

module.exports = {
    isValidQuery,
    hasOptional,
    hasFilter,
    hasOrderBy,
    hasDistinct,
    hasGroupBy,
    hasValues,
    hasUnion,
    hasNotExist,
    hasBind,
    hasMinus,
    hasSubQuery,
    hasPropertyPath,
    hasPath,
    hasSink,
    hasSource,
    hasCycle,
    hasURISubject,
    getPropertyPathPredicates,
    getPropertiesPerQuery,
    getDatatypesPerQuery,
    hasQualifiers,
    hasReferences,
    hasSitelinks,
    canBeBuiltWithDatatypes,
}
