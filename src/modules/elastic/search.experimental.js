const taxons = require("../../taxons");
const { formatNumber, formatNumbers, formatType } = require("./common/format");
const { convertJurilangToEs } = require("./common/jurilang/converter");
const { parseQuerystring } = require("./common/jurilang/parser");
const { getSearchBefore, getSearchAfter, formatSearchAfterIntoUrlParams, formatUrlParamsIntoSearchAfter } = require("./common/pagination");
const { buildSort } = require("./common/query");

function buildQuery(query) {
  const jlQuery = parseQuerystring(query.querystring)
  const esQuery = convertJurilangToEs(jlQuery.query)
  return {
    index: process.env.ELASTIC_INDEX,
    preference: 'preventbouncingresults',
    explain: false,
    size: query.batch_size || 10,
    _source: true,
    body: {
      ...esQuery, 
      highlight: { fields: { text: {} } },
      ...(query.searchAfter ? { search_after: formatUrlParamsIntoSearchAfter(query) } : {}),
      sort: buildSort(query),
    },
    querystring: jlQuery.querystring
  }
}

function formatElasticToResponse(rawResult, query) {
    const result = rawResult._source
    const sourceName = result.jurisdiction
    return {
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
        score: rawResult._score,
        highlights: rawResult.highlight
    }
}

async function batchSearch({ client }, query) {
  const { querystring, ...searchQuery } = buildQuery(query);

  const resultCount = await client.count({
    index: searchQuery.index,
    body: { query: searchQuery.body.query },
  });
  const rawResponse = await client.search(searchQuery);
  const responses = rawResponse.body.hits.hits ?? [];

  const searchBefore = await getSearchBefore(responses, searchQuery, client);
  const searchAfter = await getSearchAfter(responses, searchQuery, client);

  return {
    batch_from: searchQuery.searchAfter,
    batch_size: searchQuery.page_size,
    total: resultCount?.body?.count ?? 0,
    previous_batch: formatSearchAfterIntoUrlParams(query, searchBefore),
    next_batch: formatSearchAfterIntoUrlParams(query, searchAfter),
    took: rawResponse?.body?.took ?? 0,
    results: responses.map((_) => formatElasticToResponse(_, query)),
    querystring,
    date: new Date(),
  };
}

module.exports = batchSearch;
