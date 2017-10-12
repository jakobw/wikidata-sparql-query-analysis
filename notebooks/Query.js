const _ = require('lodash')
const traverse = require('traverse')

module.exports = class Query {
  constructor(rawQuery, parsedQuery) {
    this.rawQuery = rawQuery
    this.parsedQuery = parsedQuery
  }

  getRaw() {
    return this.rawQuery
  }

  getParsed() {
    return this.parsedQuery
  }

  traverse() {
    return traverse(this.parsedQuery)
  }

  eachNode(callback) {
    this.traverse().forEach(callback)
  }

  getSubjects() {
    return this.traverse().reduce(function(acc, node) {
      if (node.subject) acc.push(node.subject)

      return acc
    }, [])
  }

  getPredicates() {
    return this.traverse().reduce(function(acc, node) {
      if (node.predicate) acc.push(node.predicate)

      return acc
    }, [])
  }

  getObjects() {
    return this.traverse().reduce(function(acc, node) {
      if (node.object) acc.push(node.object)

      return acc
    }, [])
  }
}
