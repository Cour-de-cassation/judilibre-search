
function splitQuerystring(querystring) {
    if (!querystring) {
        return []
    }

    if(querystring.match(/^\(/)) {
        const subQuery = ['(', ...splitQuerystring(querystring.slice('('.length))]
        return [subQuery, ...splitQuerystring(querystring.slice(subQuery.flat(Infinity).join('').length))]
    }

    if(querystring.match(/^\)/)) {
        return [')']
    }

    const operator = querystring.match(/^ET|^OU|^SAUF|^PROX\/\d+/)
    if(operator) {
        return [operator[0], ...splitQuerystring(querystring.slice(operator[0].length))]
    }

    const word = querystring.match(/^\w+|^".+?"/)
    if(word) {
        return [word[0], ...splitQuerystring(querystring.slice(word[0].length))]
    }

    return [querystring[0], ...splitQuerystring(querystring.slice(1))]
}
module.exports.splitQuerystring = splitQuerystring

function cleanCaracters(querysplit) {
    return querysplit.reduce((acc, queryToken) => {
        if(Array.isArray(queryToken)) return [...acc, cleanCaracters(queryToken)]
        if(queryToken.match(/^\W*$/)) return acc

        if(queryToken.startsWith('"') && queryToken.endsWith('"')) return [...acc, queryToken.slice(1, queryToken.length -1)]
        return [...acc, queryToken]
    }, [])
}
module.exports.cleanCaracters = cleanCaracters

function isOperator(token) {
    return typeof token === "string" && !!token.match(/^ET$|^OU$|^SAUF$|^PROX\/\d+$/)
}
function cleanOperators(querysplit) {
    return querysplit.reduce((acc, queryToken, i, originalArray) => {
        const nextElement = originalArray[i+1]

        if(
            i === 0 && isOperator(queryToken) || // begin by operator
            isOperator(queryToken) && !nextElement || // ending by operator
            isOperator(queryToken) && isOperator(nextElement) // operator followed by operator
        ) {
            throw new Error("Syntax error")
        }

        const cleanedQueryToken = Array.isArray(queryToken) ? cleanOperators(queryToken) : queryToken
        if(!isOperator(cleanedQueryToken) && !!nextElement && !isOperator(nextElement)) { // not operator followed by not operator
            return [...acc, cleanedQueryToken, 'OU']
        }

        return [...acc, cleanedQueryToken]
    }, [])
}
module.exports.cleanOperators = cleanOperators

function priorizeProx(querysplit) {
    if(querysplit.length === 0) return []

    const [first, operator, ...rest] = querysplit
    const firstPriorized = typeof first !== "string" ? priorizeProx(first) : first

    if(!operator) return [firstPriorized]
    
    const maybeProx = operator.match(/^PROX\/\d+$/)
    if(!maybeProx) return [firstPriorized, operator, ...priorizeProx(rest)]

    const [second, ...nextQuerysplit] = rest
    
    if (typeof firstPriorized !== "string") {
        throw new Error("Syntax error")
    }

    if (!second || typeof second !== "string") {
        throw new Error("Syntax error")
    }

    return [[firstPriorized, operator, second], ...priorizeProx(nextQuerysplit)]
}
module.exports.priorizeProx = priorizeProx

function priorizeEt(querysplit, lastWasEt = false) {
    if(querysplit.length === 0) return []

    const [first, operator, ...rest] = querysplit
    const firstPriorized = !lastWasEt && typeof first !== "string" ? priorizeEt(first) : first

    if(!operator) return [firstPriorized]

    const maybeEt = operator.match(/^ET|SAUF$/)
    if(!maybeEt) return [firstPriorized, operator, ...priorizeEt(rest)]

    const [second, ...nextQuerysplit] = rest
    const secondPriorized = typeof second === "string" ? second : priorizeEt(second)

    return lastWasEt ?
        priorizeEt([[...firstPriorized, operator, secondPriorized], ...nextQuerysplit], lastWasEt = true) : 
        priorizeEt([[firstPriorized, operator, secondPriorized], ...nextQuerysplit], lastWasEt = true)
}
module.exports.priorizeEt = priorizeEt

function priorize(querysplit) {
    const querysplitPriorized = priorizeEt(priorizeProx(querysplit))

}
module.exports.priorize = priorize

function parseQuerysplitPriorized(querysplitPriorized = []) {
    if(querysplitPriorized.length === 0) return []

    return querysplitPriorized.reduce((acc, token) => {
        if(Array.isArray(token)) {
            const node = parseQuerysplitPriorized(token)
            return { ...acc, matchers: [...acc.matchers, node ]}
        }

        const operator = token.match(/^ET$|^OU$|^SAUF$|^PROX\/(\d+)$/)
        if(!!acc.operator && operator) return acc
        if(!operator) return { ...acc, matchers: [...acc.matchers, token ]}

        if(operator[0].startsWith('PROX')) {
            const slop = parseInt(operator[1])
            if(isNaN(slop) || slop <= 0 || slop > 10) throw new "Syntax error"
            return { ...acc, operator: "PROX", slop }
        }
        
        return { ...acc, operator: operator[0]}
    }, { matchers: [], operator: null })
}
module.exports.parseQuerysplitPriorized = parseQuerysplitPriorized

function parseQuerystring(querystring = "") {
    const querysplit = cleanOperators(cleanCaracters(splitQuerystring(querystring)))
    console.log(priorize(querysplit))
    return parseQuerysplitPriorized(priorize(querysplit))

}
module.exports.parseQuerystring = parseQuerystring