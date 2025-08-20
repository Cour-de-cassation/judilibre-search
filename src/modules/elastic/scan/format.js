const taxons = require("../../../taxons");

function inverseSort(sort) {
  return sort.map((sortRule) =>
    Object
      .entries(sortRule)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value === 'desc' ? 'asc' : value === 'asc' ? 'desc' : value }), {}),
  );
}

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

function formatNumber({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return formatPourvoiNumber(numberFull)
    return Array.isArray(numberFull)
        ? numberFull[0]
        : numberFull
}

function formatNumbers({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return numberFull ? numberFull.map(formatPourvoiNumber) : numberFull
    return Array.isArray(numberFull)
        ? numberFull
        : [numberFull]
}

function formatType(resolveReference, { type, jurisdiction: sourceName }) {
    return resolveReference && taxons[sourceName].type.taxonomy[type]
        ? taxons[sourceName].type.taxonomy[type]
        : type
}

function formatElasticToResponse(rawResult, query) {
    const result = rawResult._source
    const sourceName = result.jurisdiction

    const resume = {
        id: rawResult._id,
        jurisdiction:
            query.resolve_references && taxons[sourceName].jurisdiction.taxonomy[result.jurisdiction]
              ? taxons[sourceName].jurisdiction.taxonomy[result.jurisdiction]
              : result.jurisdiction,
        chamber:
            query.resolve_references && taxons[sourceName].chamber.taxonomy[result.chamber]
              ? taxons[sourceName].chamber.taxonomy[result.chamber]
              : result.chamber,
        number: formatNumber(result),
        numbers: formatNumbers(result),
        ecli: result.ecli,
        formation: query.resolve_references && taxons[sourceName].formation.taxonomy[result.formation]
            ? taxons[sourceName].formation.taxonomy[result.formation]
            : result.formation,
        location: query.resolve_references && taxons[sourceName].location.taxonomy[result.location]
            ? taxons[sourceName].location.taxonomy[result.location]
            : result.location,
        publication: query.resolve_references && result.publication
            ? result.publication.map((key) => {
                if (taxons[sourceName].publication.taxonomy[key]) {
                return taxons[sourceName].publication.taxonomy[key];
                }
                return key;
            })
            : result.publication,
        decision_date: result.decision_date,
        decision_datetime: result.decision_datetime,
        solution:
        query.resolve_references && taxons[sourceName].solution.taxonomy[result.solution]
            ? taxons[sourceName].solution.taxonomy[result.solution]
            : result.solution,
        solution_alt: result.solution_alt,
        ...( result.type === undefined ? {} : { type: formatType(query.resolve_references, result) }),
        summary: result.summary,
        themes: result.themes,
        nac: result.nac ? result.nac : null,
        portalis: result.portalis ? result.portalis : null,
        bulletin: result.bulletin,
        files:
        taxons[sourceName] && taxons[sourceName].filetype && taxons[sourceName].filetype.buildFilesList
            ? taxons[sourceName].filetype.buildFilesList(
                rawResult._id,
                result.files,
                query.resolve_references,
            )
            : [],
        titlesAndSummaries: result.titlesAndSummaries ? result.titlesAndSummaries : [],
        particularInterest: result.particularInterest === true,
    }

    const details = {
        source: result.source,
        text: result.displayText,
        update_date: result.update_date,
        update_datetime: result.update_datetime,
        ...(result.partial && result.zones ? {} : { zones: result.zones }),
        contested: result.contested ? result.contested : null,
        forward: result.forward ? result.forward : null,
        visa: result.visa ? result.visa.map((item) => ({ title: item })) : [],
        rapprochements: result?.rapprochements?.value ?? [],
        ...(Array.isArray(result.timeline) && result.timeline.length < 2 ? {} : { timeline: result.timeline ? result.timeline : null }),
        partial: result.partial ? result.partial : false,
        legacy: result.legacy ? result.legacy : {}
    }

        return query.abridged ? resume : { ...resume, ...details }
}

const SEARCH_AFTER_INITIAL_VALUE = "SEARCH_AFTER_INITIAL_VALUE"

function formatQueryIntoUrlParams(query) {
    const pageParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach(_ => pageParams.append(key, _))
        else pageParams.append(key, value)
    })
    return pageParams.toString();
}

function formatSearchAfterIntoUrlParams(query, searchAfter) {
    const { searchAfter: _, ...relevantQuery } = query
    if (!searchAfter) return null
    if(searchAfter === SEARCH_AFTER_INITIAL_VALUE) return formatQueryIntoUrlParams(relevantQuery)
    return formatQueryIntoUrlParams({ ...relevantQuery, searchAfter: searchAfter.join("&") })
}

function formatUrlParamsIntoSearchAfter(query) {
    const rawSearchAfter = query.searchAfter.split("&")
    return [Number(rawSearchAfter[0]), Number(rawSearchAfter[1]), rawSearchAfter[2]]
}   

module.exports = {
  SEARCH_AFTER_INITIAL_VALUE,
  inverseSort,
  formatElasticToResponse,
  formatQueryIntoUrlParams,
  formatSearchAfterIntoUrlParams,
  formatUrlParamsIntoSearchAfter
};
