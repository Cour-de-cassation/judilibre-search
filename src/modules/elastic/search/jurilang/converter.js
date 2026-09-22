function convertMatcher(matcher, field = "text") {
    if(typeof matcher !== "string") return convertQuery(matcher)

    const multiMatch = matcher.split('\s')
    if(multiMatch.length <= 0) return { match: { [field]: matcher }}
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
            return { bool: { must: matchers.map(convertMatcher), must_not: not_matchers.map(convertMatcher) }}
        case "OU":
            return { bool: { should: matchers.map(convertMatcher), minimum_should_match: 1 }}
        case "PROX":
            return { span_near: { clauses: matchers.map(convertMatcher), slop: query.slop, in_order: false } }
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