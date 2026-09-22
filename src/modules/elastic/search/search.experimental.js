const OPERATORS = /ET|OU|SAUF|PROX\/[\d+]/
const SUB_QUERY_ELEMENTS = /\(|\)/
const WORDS = /\w+|".+?"/

function parseMatchers(queryString) {
    const matchers = [...queryString.matchAll(new RegExp(`${WORDS}`, 'g'))]
    return matchers.map(_ => _[0])
}

function parseQueryTokens(querystring) {
    if (!querystring) {
        return []
    }

    if(querystring.test(/\(/)) {
        const subQuery = parseQueryTokens(querystring.slice(firstOpenQueryElement))
        return [subQuery, ...parseQueryTokens(querystring.slice(subQuery.flat(Infinity).join('').length))]
    }

    if(querystring.test(/\)/)) {
        return [')']
    }

    const operator = querystring.match(new RegExp(`^${OPERATORS.source}`))
    if(operator) {
        return [operator[0], ...parseQueryTokens(querystring.slice(operator[0].length))]
    }

    const word = querystring.match(new RegExp(`^${WORDS.source}`))
    if(word) {
        return [word[0], ...parseQueryTokens(querystring.slice(word[0].length))]
    }

    return [querystring[0], ...parseQueryTokens.slice(1)]
}
