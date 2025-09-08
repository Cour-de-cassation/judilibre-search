const taxons = require("../../../taxons");
const { INITIAL_VALUE } = require("./pagination");

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

module.exports.formatNumber = function formatNumber({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return formatPourvoiNumber(numberFull)
    return Array.isArray(numberFull)
        ? numberFull[0]
        : numberFull
}

module.exports.formatNumbers = function formatNumbers({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return numberFull ? numberFull.map(formatPourvoiNumber) : numberFull
    return Array.isArray(numberFull)
        ? numberFull
        : [numberFull]
}

module.exports.formatType = function formatType(resolveReference, { type, jurisdiction: sourceName }) {
    return resolveReference && taxons[sourceName].type.taxonomy[type]
        ? taxons[sourceName].type.taxonomy[type]
        : type
}

module.exports.formatQueryIntoUrlParams = function formatQueryIntoUrlParams(query) {
    const pageParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach(_ => pageParams.append(key, _))
        else pageParams.append(key, value)
    })
    return pageParams.toString();
}

module.exports.formatSearchAfterIntoUrlParams = function formatSearchAfterIntoUrlParams(query, searchAfter) {
    const { searchAfter: _, ...relevantQuery } = query
    if (!searchAfter) return null
    if(searchAfter === INITIAL_VALUE) return formatQueryIntoUrlParams(relevantQuery)
    return formatQueryIntoUrlParams({ ...relevantQuery, searchAfter: searchAfter.join("&") })
}

module.exports.formatUrlParamsIntoSearchAfter = function formatUrlParamsIntoSearchAfter(query) {
    const rawSearchAfter = query.searchAfter.split("&")
    return [Number(rawSearchAfter[0]), Number(rawSearchAfter[1]), rawSearchAfter[2]]
}   
