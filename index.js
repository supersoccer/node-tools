const $ = require('config')
const _ = require('lodash')
const querystring = require('querystring')
const parseUrl = require('url').parse
const moment = require('moment')

class Tools {
  constructor () {
    this.runtime = {}
    this.moment = moment
  }
  /**
 * Build complete URL with query strings
 * @param  {string} url main URL
 * @param  {mixed} qs  query string, can be string or object
 * @return {string}     complete URL
 */
  url (url, qs) {
    if (_.isEmpty(qs) || typeof qs === 'string') {
      return url
    }

    const oldQuery = this.urlQuery(url)
    const newQuery = qs
    const query = querystring.stringify(Object.assign(oldQuery, newQuery))

    return `${url}?${query}`
  }

  changeProject (projectId) {
    return this.baseUrl(this.runtime.originalUrl, { project_id: projectId })
  }

  projectUrl (path, qs) {
    const projectId = this.runtime.projectId
    qs = qs || {}

    if (_.isUndefined(projectId)) {
      return this.baseUrl(path, qs)
    }

    const query = Object.assign(qs, { project_id: projectId })

    return this.baseUrl(path, query)
  }

  urlQuery (url) {
    return parseUrl(url, true).query
  }

  baseUrl (path, qs) {
    if ((_.isEmpty(path) || _.isUndefined(path) || _.isUndefined(path)) && _.isUndefined(qs)) {
      return $.app.hostname
    }

    const query = qs || {}

    path = `${path.replace(/^\/+/, '')}`
    const url = `${$.app.hostname}/${path}`

    return this.url(url, query)
  }

  authHeader (res) {
    return `Bearer ${res.locals.accessToken}`
  }

  accessToken (res) {
    return res.locals.accessToken
  }

  getAccessBinary (n) {
    return ('0000' + (n >>> 0).toString(2)).slice(-4)
  }

  fieldTitle (fieldName) {
    const titles = fieldName.split('_')
    const _tmp = []

    for (let title of titles) {
      if (title === 'id') {
        title = 'ID'
      }

      title = title[0].toLocaleUpperCase() + title.slice(1)
      _tmp.push(title)
    }

    return _tmp.join(' ')
  }

  parseUrl (context, url) {
    const match = url.match(/(\$\{([^${}]+)\})+/gi)

    if (match) {
      match.map((val) => {
        url = url.replace(val, context[val.slice(2, -1)])
      })
    }

    return url
  }

  fillRange (num1, num2) {
    const start = num1 < num2 ? num1 : num2
    const end = num2 > num1 ? num2 : num1
    let range = Array(end - start + 1).fill().map((item, index) => start + index)

    if (num1 > num2) {
      range = range.reverse()
    }

    return range
  }
}

module.exports = new Tools()
