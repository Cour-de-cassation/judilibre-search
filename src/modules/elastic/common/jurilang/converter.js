function convertMatcher(matcher, isProx = false, field = "text") {
    if(isProx && typeof matcher !== "string") throw new Error("Conversion Error")
    if(typeof matcher !== "string") return convertQuery(matcher)

    const multiMatch = matcher.split(/\s/)
    if(multiMatch.length <= 1) return isProx ? { span_term: { [field]: matcher } } : { match: { [field]: matcher }}
    return {
        span_near: {
            clauses: multiMatch.map(_ => ({ span_term: { [field]: _ } })),
            slop: 0,
            in_order: true
        }
    }
}

function convertQuery(query) {
    switch(query.operator) {
        case "ET":
            return { bool: { must: query.matchers.map(_ => convertMatcher(_)), must_not: query.not_matchers.map(_ => convertMatcher(_)) }}
        case "OU":
            return { bool: { should: query.matchers.map(_ => convertMatcher(_)), minimum_should_match: 1 }}
        case "PROX":
            return { span_near: { clauses: query.matchers.map(_ => convertMatcher(_, true)), slop: query.slop, in_order: false } }
        case undefined:
            return convertMatcher(query.matchers[0])
        default:
            throw new Error("")
    }
}

function convertJurilangToEs(jurilang) {
    return {
        query: convertQuery(jurilang)
    }
}

module.exports.convertJurilangToEs = convertJurilangToEs