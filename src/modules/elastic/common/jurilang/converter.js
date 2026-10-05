function convertMatcher(matcher, field) {
    if (typeof matcher !== "string") return convertQuery(matcher, field)
    return { match_phrase: { [field]: matcher } }
}

function convertProx(matchers, slop, field) {
    if(matchers.some(_ => typeof _ !== "string")) throw new Error("Conversion Error")
    return {
        intervals: {
            [field]: {
                all_of: {
                    intervals: matchers.map(_ => ({ match: { query: _, max_gaps: 0, ordered: true } })),
                    max_gaps: slop,
                    ordered: true
                }
            }
        }
    }
}

function convertJurilangToEs(query, field) {
    switch (query.operator) {
        case "ET":
            return { bool: { must: (query?.matchers ?? []).map(_ => convertMatcher(_, field)), must_not: (query?.not_matchers ?? []).map(_ => convertMatcher(_, field)) } }
        case "OU":
            return { bool: { should: query.matchers.map(_ => convertMatcher(_, field)), minimum_should_match: 1 } }
        case "PROX":
            return convertProx(query.matchers, query.slop, field)
        case undefined:
            return convertMatcher(query.matchers[0], field)
        default:
            throw new Error("")
    }
}

module.exports.convertJurilangToEs = convertJurilangToEs